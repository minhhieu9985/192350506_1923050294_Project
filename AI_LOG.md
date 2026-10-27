# AI LOG — NHẬT KÝ SỬ DỤNG TRỢ LÝ AI (COMPULSORY)

> **Môn học**: Lập trình Mobile (Mobile App Development) — Đồ án Cuối kỳ  
> **Chủ đề**: Topic 02 — Campus Marketplace  
> **Quy định học thuật**: Tài liệu ghi lại toàn bộ quá trình sử dụng AI trong quá trình xây dựng dự án: đã hỏi gì, chấp nhận gì, từ chối gì và lý do.

---

## 1. Nguyên tắc Sử dụng AI của Nhóm
1. **Tech Lead Mindset**: Sử dụng AI như một kiến trúc sư hệ thống và lập trình viên cộng sự (Pair Programming).
2. **Quy trình Thực thi theo Giai đoạn (Phased Execution)**: Yêu cầu AI lập kế hoạch chi tiết (Artifact Plan) trước, chia thành các giai đoạn nhỏ và tự kiểm tra tự động (`tsc --noEmit`, `eslint`, `jest`) sau mỗi bước.
3. **Thẩm định Kỹ thuật (Verification & Critical Thinking)**: Không bao giờ chấp nhận mã nguồn chưa qua kiểm tra; luôn đối chiếu với các yêu cầu khắt khe của đề bài (không dùng màu hex trực tiếp, contrast $\ge 4.5:1$, touch target $\ge 44 \times 44$, nén ảnh).

---

## 2. Nhật ký Từng Giai đoạn

### Giai đoạn 1: Lập Kế hoạch Kiến trúc & Chọn Công nghệ
- **Nội dung yêu cầu AI**:
  - Phân tích đề bài Final Project Topic 02 (Campus Marketplace).
  - So sánh và lựa chọn giữa Zustand và Redux Toolkit, TanStack Query và RTK Query.
  - Thiết kế cấu trúc thư mục phân tách theo chuẩn Expo Router SDK 58.
- **Những gì nhóm đã chấp nhận**:
  - Chấp nhận chọn **Zustand** kết hợp `persist` middleware và selectors vì tối ưu bundle size, không có boilerplate phức tạp, tương thích tốt với React 19.
  - Chấp nhận kiến trúc lưu trữ token trong `SecureStore` và lưu cache catalogue trong `AsyncStorage`.
  - Chấp nhận ma trận 4 trạng thái (`StateView`) cho tất cả các màn hình.
- **Những gì nhóm đã từ chối & yêu cầu điều chỉnh**:
  - **Từ chối**: Đề xuất ban đầu của AI có một số file sử dụng mã màu hex inline (`#1E40AF`, `#F8FAFC`).
  - **Lý do từ chối**: Đề bài cấm tuyệt đối việc sử dụng màu hex ở bất kỳ đâu ngoài file token duy nhất.
  - **Hành động**: Bắt buộc AI tạo file `src/constants/tokens.ts` làm Single Source of Truth và dùng `ColorKey` trong toàn bộ components.

---

### Giai đoạn 2: Xử lý "Hidden Trap" — Nén Ảnh với `expo-image-manipulator`
- **Nội dung yêu cầu AI**:
  - Xây dựng tiện ích xử lý ảnh thô từ camera điện thoại để chạy mượt mà trên Wi-Fi trường học chập chờn.
  - Viết pure-logic test tính toán tỷ lệ nén và kích thước khung hình sau co tỷ lệ.
- **Những gì nhóm đã chấp nhận**:
  - Hàm `calculateTargetDimensions` giữ nguyên tỷ lệ aspect ratio với cạnh dài tối đa 1080px.
  - Nén chất lượng JPEG 70% qua `manipulateAsync`.
  - Tính toán số byte tiết kiệm và in log bằng chứng ra console cũng như hiển thị hộp thông báo xanh trực tiếp trên UI Create Listing.
- **Những gì nhóm đã từ chối & yêu cầu điều chỉnh**:
  - **Từ chối**: Sử dụng thư viện `react-native-image-resizer` (third-party native module cũ).
  - **Lý do từ chối**: Đề bài và quy chuẩn Expo khuyến nghị ưu tiên Expo native modules (`expo-image-manipulator`) để đảm bảo tính tương thích cao với Expo SDK 58.

---

### Giai đoạn 3: Xây dựng Bộ UI Components & Kiểm thử Đơn vị
- **Nội dung yêu cầu AI**:
  - Xây dựng các base components: `AppButton`, `AppInput`, `OfflineBanner`, `StateView`, `ListingCard`, `CategoryFilter`, `SearchBar`.
  - Đảm bảo độ tương phản màu sắc đạt chuẩn WCAG AA ($\ge 4.5:1$), touch target tối thiểu 44×44 pt.
  - Viết bài test component `ListingCard.test.tsx` bằng React Native Testing Library.
- **Những gì nhóm đã chấp nhận**:
  - Toàn bộ các nút bấm và vùng chạm có `minHeight: 44`, `minWidth: 44`.
  - Đầy đủ `accessibilityRole` và `accessibilityLabel` trên mọi control.
- **Phát hiện lỗi & Can thiệp kỹ thuật (Bug Caught)**:
  - Khi chạy Jest với `@testing-library/react-native`, hàm `render` trả về Promise (async) trong phiên bản mới của thư viện. Lúc đầu AI viết synchronous `const { getByText } = render(...)` gây lỗi `TypeError: getByText is not a function`.
  - **Cách xử lý**: Nhóm đã yêu cầu và sửa lại thành `await render(...)` kết hợp `screen.getByText(...)`, giúp bài test component pass 100%.

---

### Giai đoạn 4: Màn hình Cốt lõi & Phân quyền Role-based Views
- **Nội dung yêu cầu AI**:
  - Triển khai 5+ màn hình: Auth, Home Catalogue, Listing Detail, Modal Create Listing, Cart Checkout, Favourites, 404 Not Found.
  - Tích hợp tính năng điểm > 8: Role-based views (Buyer vs Seller), Price-drop notification, Pull-to-refresh với timestamp.
- **Những gì nhóm đã chấp nhận**:
  - Tính toán search và category filter trực tiếp trong lúc render bằng `useMemo` (**không lưu derived state** trong `useState`).
  - Nút chuyển đổi nhanh vai trò `Buyer` $\leftrightarrow$ `Seller` ngay trên header Tab Bar để giáo viên kiểm tra nhanh khi chấm viva.
  - Banner ngoại tuyến tự động bật/tắt theo trạng thái kết nối mạng của thiết bị.

---

### Giai đoạn 5: Critical Path Test & Hoàn thiện
- **Nội dung yêu cầu AI**:
  - Viết bài kiểm thử luồng chính: Giỏ hàng trống $\rightarrow$ Thêm sách $\rightarrow$ Tính phí ship $\rightarrow$ Đạt ngưỡng freeship $\ge 200.000$đ $\rightarrow$ Cảnh báo khi vượt quá tồn kho của người bán.
- **Những gì nhóm đã chấp nhận**:
  - Bài test `cartFlow.test.ts` kiểm thử toàn diện luồng nghiệp vụ.
  - Thiết lập `jest.setup.js` mock chuẩn `AsyncStorage`, `SecureStore`, `expo-notifications`.
  - Kết quả kiểm thử: **4 test suites, 18/18 tests passed 100%**.

---

## 3. Tổng kết Đánh giá Sử dụng AI
- **Điểm mạnh của AI**: Hỗ trợ viết boilerplate nhanh, tính toán toán học chính xác (ka-tex, color contrast, aspect ratio ratio), scaffold cấu trúc dự án chuẩn chỉ.
- **Điểm cần lưu ý**: Cần giám sát chặt chẽ các thay đổi API của Expo/React Native (như React 19 async render trong testing, native module mocks trong Jest), đồng thời kiên quyết từ chối mã màu hex trực tiếp để tuân thủ 100% tiêu chí chấm điểm của giảng viên.
