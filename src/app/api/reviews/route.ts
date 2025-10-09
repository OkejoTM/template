import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // получаем данные из бд

    const { fullName, rate, description, dateTime, userLocale, addedByUser } =
      body; // формируем поля для записи

    if (!fullName || !rate || !dateTime || !userLocale || !addedByUser) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({ data: {
      fullname: fullName,
      rate,
      description,
      datetime: dateTime,
      userLocale,
      addedByUserId: addedByUser,
    }}); // делаем запись в бд

    const reviewResponse = {
      id: newReview.id,
      fullName: newReview.fullname,
      rate: newReview.rate,
      description: newReview.description,
      dateTime: newReview.datetime,
      userLocation: newReview.userLocale,
      addedByUser: newReview.addedByUserId,
      createdAt: newReview.createdAt,
    }; // формируем ответ

    return NextResponse.json(reviewResponse); // возвращаем данные
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany(); // ищем все данные в бд
    return NextResponse.json(reviews); // возвращаем
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
