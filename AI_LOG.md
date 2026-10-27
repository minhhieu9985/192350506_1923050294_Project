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

### Giai đoạn 6: Kiểm thử Web Platform & Fix Lỗi Lồng Thẻ (<button> nested <button>)
- **Vấn đề phát hiện khi chạy thực tế trên Web**:
  - Khi chạy `npx expo start --web`, trình duyệt hiển thị lỗi: `Console Error: <button> cannot contain a nested <button>`.
  - **Nguyên nhân**: React Native Web chuyển đổi các component có `onPress` hoặc `accessibilityRole="button"` thành thẻ HTML `<button>`. Trong `ListingCard.tsx`, cả thẻ Card bên ngoài được bọc bằng `<TouchableOpacity>` và bên trong lại chứa nút Favorite và nút Add to Cart (cũng là `<TouchableOpacity>`), dẫn đến việc một thẻ `<button>` bị lồng bên trong một thẻ `<button>` khác, vi phạm tiêu chuẩn HTML5.
- **Giải pháp xử lý triệt để**:
  - Đổi thẻ bọc ngoài cùng của `ListingCard` thành `<View>`.
  - Tách vùng xem chi tiết (ảnh bìa, tiêu đề, giá) và các nút tương tác nhanh (nút Thích, nút Thêm vào giỏ) thành các phần tử anh em (**siblings**), không bọc lồng nhau.
  - Thêm `pointerEvents="none"` cho các badge overlay thông tin.
- **Kết quả xác minh**:
  - Giao diện trên nền tảng Web hiển thị mượt mà, không còn bất kỳ lỗi console log nào.
  - Cả 18 bài test tự động (`npm test`), `npx tsc --noEmit` và `npm run lint` đạt 0 lỗi 100%.

---

### Giai đoạn 7: Fix Lỗi Lặp Vô Hạn Selector Zustand (Maximum update depth exceeded)
- **Vấn đề phát hiện tại `/cart` trên Web**:
  - Khi truy cập route `/cart`, trình duyệt ném lỗi: `Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate...`.
  - **Nguyên nhân chính xác**:
    - Trong `src/store/cartStore.ts`, hàm selector `selectCartSummary` được định nghĩa là: `(state) => calculateOrderSummary(state.items)`.
    - Hàm `calculateOrderSummary` luôn trả về một object mới `{ itemCount, subtotal, deliveryFee, total, ... }` trên mỗi lần chạy.
    - Trong React 18/19 và Zustand v5, cơ chế `useSyncExternalStore` so sánh tham chiếu (`Object.is(prev, next)`). Do mỗi lần selector được gọi đều trả về một tham chiếu object mới, React lầm tưởng state luôn thay đổi và liên tục kích hoạt re-render vô tận.
- **Giải pháp xử lý triệt để**:
  - Xóa bỏ `selectCartSummary` khỏi selector trực tiếp của Zustand.
  - Tại màn hình [cart.tsx](file:///d:/laptrinhmobile/tuan10/Campus_Marketplace/src/app/(tabs)/cart.tsx), chỉ lấy mảng `cartItems = useCartStore(selectCartItems)` (tham chiếu mảng ổn định).
  - Tính toán `summary` trong lúc render bằng `useMemo`: `const summary = useMemo(() => calculateOrderSummary(cartItems), [cartItems]);`.
  - Khi đó, `summary` chỉ được tính toán lại khi mảng `cartItems` thực sự thay đổi (khi thêm, bớt hoặc đổi số lượng), chấm dứt hoàn toàn vòng lặp vô hạn.
- **Kết quả xác minh**:
  - Truy cập route `/cart` trên trình duyệt tải ngay lập tức, mượt mà và không còn hiện tượng render lặp.
  - `npx tsc --noEmit`: 0 lỗi.
  - `npm run lint`: 0 lỗi, 0 warnings.
  - `npm test`: 18/18 tests passed.

---

### Giai đoạn 8: Kiểm thử Thực tế (UAT) & Sửa các Lỗi Tương tác UI/UX
- **Nội dung yêu cầu AI**:
  - Chạy thử nghiệm thực tế trên nền tảng Web và xử lý các lỗi tương tác (interaction bugs), lỗi đồng bộ dữ liệu (data desync) và lỗi layout hiển thị.

- **Những lỗi thực tế đã phát hiện & Cách xử lý**:
  1. **Lỗi Đồng bộ Dữ liệu Đăng nhập (MSSV & Tên người bán)**:
     - *Vấn đề*: Khi đăng nhập bằng MSSV mới, Header hiển thị đúng nhưng danh sách sản phẩm vẫn hiện tên cũ (Nguyễn Hoàng Nam) do dữ liệu bị hardcode trong seed data.
     - *Cách sửa*: Yêu cầu AI xóa dữ liệu seed cũ, cập nhật trường sellerId thành dãy 10 chữ số (định dạng MSSV trường) và đồng bộ logic khi tạo Listing mới phải lấy user đang đăng nhập.
  2. **Lỗi Ảnh bị Phóng to Quá cỡ (UI Layout)**:
     - *Vấn đề*: Trên Web, ảnh trong ListingCard phình to chiếm cả màn hình do thiếu thuộc tính chiều cao.
     - *Cách sửa*: Yêu cầu AI bọc ảnh vào một View có aspectRatio: 16/9 hoặc set height cố định, dùng resizeMode="cover".
  3. **Lỗi Dữ liệu bị "Bay màu" sau khi F5 (Offline Persistence)**:
     - *Vấn đề*: Tạo sản phẩm mới xong, F5 lại thì sản phẩm biến mất. Ảnh bị hỏng (broken image).
     - *Nguyên nhân*: Do ảnh lưu dạng blob: URL tạm thời của trình duyệt, và dữ liệu chỉ lưu trong RAM thay vì AsyncStorage.
     - *Cách sửa*: Yêu cầu AI chuyển logic nén ảnh sang trả về chuỗi Base64 để lưu vĩnh viễn. Đồng thời cấu hình lại mockApi.ts để lưu danh sách sản phẩm vào AsyncStorage.
  4. **Lỗi Trái tim (Favourite) không đổi màu ngay lập tức**:
     - *Vấn đề*: Bấm nút Yêu thích nhưng UI không cập nhật, phải F5 mới thấy màu đỏ.
     - *Nguyên nhân*: Hàm toggleFavourite trong Zustand vô tình mutate (thay đổi trực tiếp) mảng state, khiến React không nhận diện được sự thay đổi để re-render.
     - *Cách sửa*: Yêu cầu AI sửa lại hàm cập nhật state theo chuẩn immutable (tạo mảng mới bằng spread operator) và sử dụng useFavouritesStore((state) => state.favourites.includes(id)) trong Selector.
  5. **Lỗi Mất trạng thái Đăng nhập sau khi F5**:
     - *Vấn đề*: Đã bấm Đăng xuất, nhưng khi khởi động lại app vẫn vào được Trang chủ.
     - *Cách sửa*: Yêu cầu AI thêm Auth Guard vào file src/app/_layout.tsx, kiểm tra nếu state user là null thì ép điều hướng về /sign-in.
  6. **Lỗi Thiếu tính năng Nghiệp vụ (Gỡ sản phẩm)**:
     - *Vấn đề*: Người bán không có nút gỡ sản phẩm của mình.
     - *Cách sửa*: Yêu cầu AI viết thêm hàm deleteListing vào Mock API, tạo hook useDeleteListing, và thêm nút "Gỡ sản phẩm" màu đỏ ở màn hình Chi tiết (chỉ hiển thị khi Role là Seller và đúng ID người đăng).

- **Đánh giá của nhóm**: AI rất mạnh trong việc tạo code mới, nhưng các lỗi tương tác (Interaction Bugs) và đồng bộ trạng thái (State Desync) chỉ có thể được phát hiện qua quá trình tự tay test UAT (User Acceptance Testing) của nhóm. Việc đưa ra các prompt debug chi tiết (kèm ảnh chụp màn hình lỗi) giúp AI sửa lỗi chính xác 100% ngay lần đầu.

---

## 3. Tổng kết Đánh giá Sử dụng AI
- **Điểm mạnh của AI**: Hỗ trợ viết boilerplate nhanh, tính toán toán học chính xác (ka-tex, color contrast, aspect ratio ratio), scaffold cấu trúc dự án chuẩn chỉ.
