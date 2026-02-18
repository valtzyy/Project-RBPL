// app/api/barang/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function POST(request: Request) {
  try {
    //Ambil data JSON dari body request
    const body = await request.json();

    //Validasi data
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Format data salah. Harus berupa Array JSON [...]" },
        { status: 400 },
      );
    }

    //Masukkan ke Database
    const result = await prisma.barang.createMany({
      data: body.map((item) => ({
        kodeBarang: item.kodeBarang,
        namaBarang: item.namaBarang,
        stok: Number(item.stok), // Pastikan tipe number
        harga: item.harga, // Decimal di Prisma bisa terima number/string
        satuan: item.satuan,
        deskripsi: item.deskripsi,
      })),
      skipDuplicates: true, // PENTING: Jika kode barang sudah ada, skip (jangan error)
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} barang berhasil ditambahkan!`,
    });
  } catch (error) {
    console.error("Gagal insert barang:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
