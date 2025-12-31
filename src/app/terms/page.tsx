import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
                    <Scale className="h-6 w-6 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-bold font-outfit text-white">Điều khoản sử dụng</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
                <p className="text-muted-foreground">
                    Cập nhật lần cuối: Tháng 12, 2024
                </p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">1. Giới thiệu</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Chào mừng bạn đến với NckxEdu - nền tảng ôn thi trực tuyến dành cho học sinh THPT.
                        Khi truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản dưới đây.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">2. Nội dung và Sở hữu trí tuệ</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Tất cả nội dung trên NckxEdu, bao gồm câu hỏi trắc nghiệm, đề thi thử, bài giảng và tài liệu học tập,
                        được biên soạn bởi công nghệ Trí tuệ Nhân tạo (AI) và được kiểm duyệt kỹ lưỡng bởi đội ngũ chuyên gia.
                        Nội dung này thuộc quyền sở hữu của NckxEdu và được bảo hộ bởi luật sở hữu trí tuệ Việt Nam.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Bạn được phép sử dụng nội dung cho mục đích học tập cá nhân. Việc sao chép, phân phối,
                        hoặc sử dụng thương mại mà không có sự đồng ý bằng văn bản là bị nghiêm cấm.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">3. Nội dung do AI tạo ra</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        NckxEdu sử dụng công nghệ AI tiên tiến để biên soạn câu hỏi và nội dung học tập.
                        Mặc dù chúng tôi nỗ lực đảm bảo độ chính xác cao nhất, nội dung do AI tạo ra có thể
                        chứa một số sai sót. Chúng tôi khuyến khích người dùng báo cáo bất kỳ lỗi nào phát hiện được.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">4. Tài khoản người dùng</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình. NckxEdu không chịu trách nhiệm
                        cho bất kỳ thiệt hại nào phát sinh từ việc truy cập trái phép vào tài khoản của bạn do
                        sự bất cẩn trọng của bạn.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">5. Giới hạn trách nhiệm</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        NckxEdu cung cấp dịch vụ "như hiện có" và không đảm bảo kết quả học tập cụ thể.
                        Thành tích trong kỳ thi thực tế phụ thuộc vào nhiều yếu tố, bao gồm nhưng không
                        giới hạn ở nỗ lực cá nhân của học sinh.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">6. Thay đổi điều khoản</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào. Những thay đổi quan trọng
                        sẽ được thông báo qua email hoặc trên website. Việc tiếp tục sử dụng dịch vụ sau khi
                        thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">7. Liên hệ</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua email:
                        <span className="text-cyan-400 ml-1">support@nckxedu.vn</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
