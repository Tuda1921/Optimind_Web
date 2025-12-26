// SỬA DÒNG IMPORT NÀY: Dùng instance có sẵn từ lib/db thay vì tự new PrismaClient()
import { prisma } from '../lib/db'; 

async function main() {
  // 1. Nhập email của tài khoản bạn muốn thêm dữ liệu test
  const TARGET_EMAIL = "demo@optimind.com"; // Hoặc đổi thành email user bạn đang dùng

  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.log(`❌ Không tìm thấy user ${TARGET_EMAIL}. Hãy chạy seed gốc trước hoặc đăng ký user này.`);
    return;
  }

  console.log(`🌱 Đang tạo dữ liệu lịch sử cho ${user.name}...`);

  const sessionsToCreate = [];
  const now = new Date();

  // Tạo dữ liệu cho 7 ngày qua
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Mỗi ngày tạo 1-3 phiên học ngẫu nhiên
    const sessionsCount = Math.floor(Math.random() * 3) + 1; 

    for (let j = 0; j < sessionsCount; j++) {
      // Random thời lượng 25 - 90 phút
      const durationMinutes = Math.floor(Math.random() * 65) + 25; 
      const durationSeconds = durationMinutes * 60;
      
      // Random điểm tập trung 40 - 100
      const focusScore = Math.floor(Math.random() * 60) + 40; 
      
      // Thời gian bắt đầu (lùi lại các khung giờ khác nhau trong ngày)
      const startTime = new Date(date);
      startTime.setHours(8 + j * 4 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 59), 0, 0); 
      
      const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

      // Tạo Session
      // Sử dụng prisma.studySession.create thay vì prisma.studySession.create
      const session = await prisma.studySession.create({
        data: {
          userId: user.id,
          startTime: startTime,
          endTime: endTime,
          duration: durationSeconds,
          focusScore: focusScore,
          taskTitle: i === 0 ? "Học Next.js nâng cao" : ["Ôn tập Toán", "Luyện nghe tiếng Anh", "Đọc sách lịch sử"][Math.floor(Math.random() * 3)],
          coinsEarned: durationMinutes * (focusScore > 70 ? 3 : 1), 
          expEarned: durationMinutes * 5 + (focusScore > 80 ? 50 : 0),
          // Tạo Focus Logs giả để vẽ biểu đồ chi tiết
          focusLogs: {
            create: Array.from({ length: 10 }).map((_, idx) => ({
              score: Math.min(100, Math.max(0, focusScore + Math.floor(Math.random() * 30) - 15)), // Dao động quanh điểm TB
              timestamp: new Date(startTime.getTime() + (idx * (durationSeconds * 1000) / 10))
            }))
          }
        },
      });
      sessionsToCreate.push(session);
    }
  }

  console.log(`✅ Đã thêm ${sessionsToCreate.length} phiên học vào lịch sử.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Không cần gọi disconnect thủ công nếu lib/db quản lý, 
    // nhưng để an toàn trong script rời thì cứ gọi
    await prisma.$disconnect();
  });