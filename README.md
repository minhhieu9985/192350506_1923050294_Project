# Campus Marketplace — Ứng Dụng Mua Bán Khuôn Viên Đại Học

> **Đồ án cuối kỳ môn Lập trình Mobile (Final Project — Topic 02: Campus Marketplace)**  
> **Trường**: Trường Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin  
> **Mã lớp**: TH7011101 (23DTH1)  
> **Nhóm thực hiện**: Tối đa 3 sinh viên  

---

## 1. Giới thiệu Dự án
**Campus Marketplace** là giải pháp ứng dụng di động mua bán, trao đổi giáo trình cũ và đồ dùng học tập giữa các sinh viên trong cùng khuôn viên trường đại học. 

### Các đặc điểm cốt lõi:
- **Offline-First**: Hoạt động bền vững ngay cả trong điều kiện mạng Wi-Fi trường học chập chờn (**patchy campus wifi**). Dữ liệu được cache tự động bằng TanStack Query và AsyncStorage; hiển thị banner cảnh báo ngoại tuyến rõ ràng, tuyệt đối không bao giờ để trắng màn hình.
- **Giải quyết Hidden Trap (Nén ảnh thông minh)**: Ảnh chụp trực tiếp từ camera điện thoại (dung lượng lớn 3MB–12MB) được tự động co tỉ lệ và nén qua `expo-image-manipulator` (giảm $\approx 90\%$ dung lượng) trước khi tải lên, hiển thị bằng chứng tiết kiệm băng thông rõ ràng trên giao diện.
- **Tuân thủ Design Tokens & Không dùng màu hex trực tiếp**: Toàn bộ ứng dụng sử dụng một file token duy nhất `src/constants/tokens.ts`, đáp ứng chuẩn WCAG AA độ tương phản $\ge 4.5:1$ ở cả Light Mode và Dark Mode.
- **Phân quyền người dùng (Role-based Views)**: Phân tách rõ ràng giữa trải nghiệm sinh viên tìm mua (**Buyer**) và sinh viên đăng bán (**Seller**).
- **Price-Drop Local Notifications**: Thông báo cục bộ qua `expo-notifications` khi giáo trình trong danh sách yêu thích giảm giá.

---

## 2. Công nghệ & Thư viện sử dụng
- **Nền tảng**: React Native, Expo SDK 58 (Expo Router v58).
- **Ngôn ngữ**: TypeScript ở chế độ Strict Mode (`strict: true`).
- **Quản lý trạng thái client**: Zustand (kèm middleware `persist` qua AsyncStorage và selectors tối ưu render).
- **Quản lý dữ liệu server**: TanStack Query (React Query) với thời gian lưu cache thông minh.
- **Lưu trữ bảo mật**: Expo SecureStore cho thông tin phiên sinh viên.
- **Xử lý hình ảnh**: `expo-image-manipulator` & `expo-image-picker`.
- **Thông báo & Mạng**: `expo-notifications`, `expo-network`.
- **Kiểm thử tự động**: Jest, Jest-Expo, `@testing-library/react-native`.
- **Linter**: ESLint 9 với `eslint-config-expo`.

---

## 3. Hướng dẫn Cài đặt & Khởi chạy (Từ Máy Sạch)

### Yêu cầu tiên quyết:
- Đã cài đặt **Node.js** (phiên bản 18 trở lên hoặc 20 LTS).
- Thiết bị cài đặt ứng dụng **Expo Go** (Android/iOS) hoặc máy ảo Android Studio / iOS Simulator.

### Các bước cài đặt:
```bash
# 1. Clone repository
git clone <URL_REPOSITORY_CUA_BAN>
cd Campus_Marketplace

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi động Expo Development Server
npm start
# hoặc: npx expo start
```

### Các lệnh kiểm tra chất lượng code:
```bash
# Kiểm tra TypeScript strict không lỗi:
npx tsc --noEmit

# Kiểm tra Linter sạch 100%:
npm run lint

# Chạy toàn bộ 18 bài kiểm thử tự động (Pure Logic, Component, Critical Path):
npm test
```

---

## 4. Cấu trúc Thư mục Dự án

```text
src/
├── app/                        # Expo Router (file-based navigation)
│   ├── (auth)/sign-in.tsx      # Màn hình Đăng nhập (Demo Buyer & Seller)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab Bar, Badge giỏ hàng, Nút chuyển vai trò
│   │   ├── index.tsx           # Home Catalogue (Search, Filter, Pull-to-refresh)
│   │   ├── favourites.tsx      # Danh sách Yêu thích (Sync 2 chiều)
│   │   └── cart.tsx            # Giỏ hàng, Quy tắc miễn phí ship, Thanh toán
│   ├── listing/[id].tsx        # Chi tiết sản phẩm (Dynamic Route, Role-based view)
│   ├── (modal)/create-listing.tsx # Modal Đăng tin, Nén ảnh tự động
│   ├── +not-found.tsx          # Màn hình 404 thân thiện
│   └── _layout.tsx             # Root layout cấu hình QueryClient & Status Bar
├── components/
│   ├── common/                 # AppButton, AppInput, StateView, OfflineBanner
│   └── listing/                # ListingCard, CategoryFilter, SearchBar
├── constants/
│   └── tokens.ts               # FILE DUY NHẤT CHỨA MÀU SẮC, SPACING, RADII
├── hooks/                      # useThemeColor, useListingsQuery, useNetworkStatus
├── services/                   # secureStorage, notifications, mockApi
├── store/                      # authStore, favouritesStore, cartStore
├── types/                      # Listing, CartItem, User, OrderSummary
└── utils/                      # imageCompression, cartCalculations, formatters
```

---

## 5. Danh sách Màn hình & Xử lý 4 Trạng thái (4-State Matrix)

Mọi màn hình đều được bọc bởi component `StateView` để xử lý triệt để 4 trạng thái:
1. **Loading**: Skeleton placeholder hoặc ActivityIndicator với nhãn accessibility rõ ràng.
2. **Empty**: Icon thân thiện, thông báo giải thích và nút hành động (Call To Action).
3. **Error**: Thông báo lỗi mất kết nối mạng kèm nút **"Thử lại" (Retry)** hoạt động thực tế.
4. **Content**: Dữ liệu hiển thị trực quan, mượt mà.

---

## 6. Hướng dẫn Test Nhanh Buổi Bảo Vệ (Viva Demonstration)

1. **Test Đăng nhập & Session**:
   - Mở màn hình đăng nhập, nhấn nút **"Demo: Sinh viên Mua (Buyer)"** hoặc **"Demo: Sinh viên Bán (Seller)"**.
   - Đóng hoàn toàn app và mở lại $\rightarrow$ Session vẫn được lưu trong `SecureStore`.
2. **Test Search & Category Filter**:
   - Nhập từ khóa: "Cấu trúc" hoặc chọn danh mục "Electronics" $\rightarrow$ Dữ liệu lọc ngay lập tức lúc render, không lưu state thừa.
3. **Test Role-based View**:
   - Ở góc trên cùng bên phải thanh Tab Bar, nhấn vào huy hiệu vai trò để đổi giữa `Buyer` và `Seller`.
   - Vào chi tiết sản phẩm: Vai trò `Buyer` sẽ thấy nút Thêm vào giỏ; Vai trò `Seller` sẽ thấy nút Quản lý tồn kho & Test Price Drop.
4. **Test Nén Ảnh (Hidden Trap)**:
   - Nhấn nút tròn dấu cộng $(+)$ ở góc dưới màn hình Home để mở Modal đăng bán.
   - Chọn ảnh bất kỳ từ thư viện $\rightarrow$ Hệ thống tự động nén và hiển thị hộp xanh: *"Ảnh gốc: 3500 KB ➔ Sau nén: 210 KB (Tiết kiệm ~94% dung lượng)"*.
5. **Test Quy tắc Giỏ hàng & Freeship**:
   - Mua 1 cuốn sách (65.000đ): Phí ship = 15.000đ.
   - Tăng số lượng để tổng $\ge 200.000$đ: Phí ship chuyển thành **0đ (Miễn phí Freeship)**.
   - Tăng vượt quá tồn kho của người bán: Hiện thông báo cảnh báo đỏ rõ ràng.
