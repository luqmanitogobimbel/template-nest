import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService is implemented
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Prisma.productsCreateInput) {
    return await this.prisma.products.create({
      data,
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(id: number, data: Prisma.productsCreateInput) {
    const product = await this.prisma.products.update({
      where: { id },
      data,
    });
    return product;
  }

  async deleteProduct(id: number) {
    await this.prisma.products.delete({
      where: { id },
    });
    return { message: 'Product deleted successfully' };
  }
}
