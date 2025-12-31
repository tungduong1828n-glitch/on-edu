import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
                    <Lock className="h-6 w-6 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-bold font-outfit text-white">Chính sách bảo mật</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
                <p className="text-muted-foreground">
                    Cập nhật lần cuối: Tháng 12, 2024
                </p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">1. Thông tin chúng tôi thu thập</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Khi bạn sử dụng NckxEdu, chúng tôi có thể thu thập các thông tin sau:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Thông tin cá nhân: Họ tên, email, trường học</li>
                        <li>Dữ liệu học tập: Kết quả làm bài, tiến độ học tập, thời gian sử dụng</li>
                        <li>Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt, thiết bị sử dụng</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">2. Mục đích sử dụng thông tin</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Chúng tôi sử dụng thông tin của bạn để:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Cung cấp và cá nhân hóa trải nghiệm học tập</li>
                        <li>Phân tích và gợi ý nội dung phù hợp với trình độ</li>
                        <li>Gửi thông báo về khóa học, cập nhật hệ thống</li>
                        <li>Cải thiện chất lượng dịch vụ</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">3. Bảo vệ dữ liệu</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        NckxEdu cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi sử dụng các biện pháp
                        bảo mật tiêu chuẩn công nghiệp bao gồm mã hóa SSL/TLS, lưu trữ an toàn và kiểm soát
                        truy cập nghiêm ngặt.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">4. Chia sẻ thông tin</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Chúng tôi KHÔNG bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích
                        thương mại. Thông tin chỉ được chia sẻ trong các trường hợp:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Khi có sự đồng ý của bạn</li>
                        <li>Để tuân thủ yêu cầu pháp lý</li>
                        <li>Để bảo vệ quyền lợi hợp pháp của NckxEdu</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">5. Quyền của bạn</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Bạn có quyền:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Truy cập và xem thông tin cá nhân của mình</li>
                        <li>Yêu cầu chỉnh sửa hoặc xóa thông tin</li>
                        <li>Từ chối nhận email tiếp thị</li>
                        <li>Yêu cầu xuất dữ liệu cá nhân</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">6. Cookie</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, lưu trữ trạng thái đăng nhập
                        và phân tích lưu lượng truy cập. Bạn có thể tắt cookie trong trình duyệt, nhưng điều này
                        có thể ảnh hưởng đến một số tính năng của website.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">7. Liên hệ</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Nếu bạn có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ:
                        <span className="text-cyan-400 ml-1">privacy@nckxedu.vn</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
