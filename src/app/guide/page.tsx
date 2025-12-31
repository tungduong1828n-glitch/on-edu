import Link from 'next/link';
import { ArrowLeft, BookOpen, MousePointer, BarChart3, Clock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link href="/">
                <Button variant="ghost" className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </Link>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-bold font-outfit text-white">Hướng dẫn sử dụng</h1>
            </div>

            <div className="space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <MousePointer className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">1. Bắt đầu học tập</h2>
                    </div>
                    <div className="ml-13 space-y-3 text-muted-foreground">
                        <p>Từ trang chủ, click vào "Bắt đầu học ngay" để vào trang Dashboard.</p>
                        <p>Chọn môn học bạn muốn ôn tập từ danh sách 8+ môn học.</p>
                        <p>Mỗi môn học được chia thành các chương và bài học theo chương trình của Bộ GD-ĐT.</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">2. Làm bài trắc nghiệm</h2>
                    </div>
                    <div className="ml-13 space-y-3 text-muted-foreground">
                        <p>Mỗi bài học có các câu hỏi trắc nghiệm để kiểm tra kiến thức.</p>
                        <p>Bạn có thể chọn làm bài theo thời gian giới hạn hoặc không giới hạn.</p>
                        <p>Sau khi nộp bài, hệ thống sẽ chấm điểm và hiển thị đáp án chi tiết.</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">3. Thi thử</h2>
                    </div>
                    <div className="ml-13 space-y-3 text-muted-foreground">
                        <p>Truy cập mục "Đề thi thử" để làm các đề thi mô phỏng kỳ thi THPT Quốc gia.</p>
                        <p>Đề thi được thiết kế giống hệt cấu trúc và thời gian thi thật.</p>
                        <p>Kết quả sẽ được phân tích chi tiết, chỉ ra những dạng bài bạn cần cải thiện.</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">4. Câu hỏi thường gặp</h2>
                    </div>
                    <div className="ml-13 space-y-6">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="font-medium text-white mb-2">Nội dung câu hỏi được lấy từ đâu?</p>
                            <p className="text-muted-foreground text-sm">
                                Tất cả câu hỏi được biên soạn bởi công nghệ AI tiên tiến, dựa trên chương trình
                                SGK mới nhất và các đề thi các năm trước. Nội dung được kiểm duyệt kỹ lưỡng
                                để đảm bảo độ chính xác.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="font-medium text-white mb-2">Có mất phí sử dụng không?</p>
                            <p className="text-muted-foreground text-sm">
                                Hiện tại NckxEdu hoàn toàn miễn phí cho học sinh. Chúng tôi muốn mang đến
                                cơ hội học tập bình đẳng cho tất cả mọi người.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="font-medium text-white mb-2">Làm sao để báo lỗi nội dung?</p>
                            <p className="text-muted-foreground text-sm">
                                Nếu phát hiện lỗi trong câu hỏi hoặc đáp án, bạn có thể báo cáo qua trang
                                Liên hệ hoặc email: support@nckxedu.vn. Chúng tôi sẽ xem xét và sửa chữa trong 24 giờ.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
