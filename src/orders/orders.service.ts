import { BooksService } from 'src/books/books.service';
import { BookEntity } from 'src/books/entities/book.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersBooksEntity } from './entities/orders-books.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersBooksEntity)
    private readonly obRepository: Repository<OrdersBooksEntity>,
    @Inject(forwardRef(() => BooksService))
    private readonly booksService: BooksService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.updatedBy = currentUser;

    const orderTbl = await this.orderRepository.save(orderEntity);

    const obEntity: {
      order: OrderEntity;
      book: BookEntity;
      quantity: number;
      price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedBooks.length; i++) {
      const order = orderTbl;
      const book = await this.booksService.findOne(
        createOrderDto.orderedBooks[i].id,
      );
      const quantity = createOrderDto.orderedBooks[i].quantity;
      const price = createOrderDto.orderedBooks[i].price;
      obEntity.push({
        order,
        book,
        quantity,
        price,
      });
    }

    await this.obRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersBooksEntity)
      .values(obEntity)
      .execute();

    return await this.findOne(orderTbl.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        updatedBy: true,
        orderBook: { order: true },
      },
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'shippingAddress',
        'updatedBy',
        'orderBook',
        'orderBook.order',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findOneByBookId(id: number) {
    return await this.obRepository.findOne({
      relations: { book: true },
      where: { book: { id: id } },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status != OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivery before shipped !!!`);
    }
    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
    return order;
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order Not Found.');

    if (order.status === OrderStatus.CANCELLED) return order;

    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED);
    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found.');

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot delete a delivered order.');
    }

    // Remove associated order products
    await this.obRepository.delete({ order: { id } });

    // Remove the order itself
    await this.orderRepository.delete(id);

    return `Order #${id} has been successfully removed.`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const ob of order.orderBook) {
      await this.booksService.updateStock(ob.book.id, ob.quantity, status);
    }
  }
}
