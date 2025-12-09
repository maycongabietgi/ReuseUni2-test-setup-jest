[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=maycongabietgi_ReuseUni2-test-setup-jest&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=maycongabietgi_ReuseUni2-test-setup-jest)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=maycongabietgi_ReuseUni2-test-setup-jest&metric=coverage)](https://sonarcloud.io/summary/new_code?id=maycongabietgi_ReuseUni2-test-setup-jest)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=maycongabietgi_ReuseUni2-test-setup-jest&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=maycongabietgi_ReuseUni2-test-setup-jest)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=maycongabietgi_ReuseUni2-test-setup-jest&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=maycongabietgi_ReuseUni2-test-setup-jest)

[![SonarCloud](https://github.com/maycongabietgi/ReuseUni2-test-setup-jest/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/maycongabietgi/ReuseUni2-test-setup-jest/actions/workflows/sonarcloud.yml)


# ✅ Testing Setup - ReuseUni Project

Hướng dẫn setup và viết test cho dự án React Native sử dụng **Jest** và **@testing-library/react-native**.

---

## 📦 1. Cài đặt thư viện test

Đầu tiên, cài đặt các dependencies cần thiết:

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native @types/jest react-test-renderer
```

**Giải thích:**

- `jest`: Framework testing chính
- `@testing-library/react-native`: Thư viện test React Native components
- `@testing-library/jest-native`: Thêm các matcher tiện ích (như `toBeVisible()`, `toHaveTextContent()`)
- `@types/jest`: TypeScript definitions cho Jest
- `react-test-renderer`: Render components trong môi trường test

---

## ⚙️ 2. Cấu hình Jest

### 📄 jest.config.js (root dự án)

Tạo file `jest.config.js` ở root của project:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transform React Native modules
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|' +
      'react-native|' +
      'react-native-linear-gradient|' +
      '@react-navigation|' +
      'react-native-safe-area-context|' +
      'react-native-gesture-handler' +
      ')/)',
  ],

  // Mock assets (images, fonts)
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Coverage config
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.styles.ts',
  ],

  coverageReporters: ['html', 'text', 'lcov'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
};
```

**Giải thích từng phần:**

- `preset: 'react-native'`: Sử dụng preset React Native có sẵn
- `setupFilesAfterEnv`: File chạy sau khi môi trường test được setup
- `transformIgnorePatterns`: Cho phép Jest transform các modules React Native (mặc định Jest ignore node_modules)
- `moduleNameMapper`: Mock các file assets (ảnh, font) thành string rỗng
- `collectCoverageFrom`: Thu thập coverage từ file nào, exclude file nào
- `testMatch`: Pattern để tìm test files

---

## 🧩 3. File setup Jest

### 📄 jest.setup.js (root dự án)

Tạo file `jest.setup.js`:

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock console warnings (optional - để test log clean hơn)
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

**Giải thích:**

- Dòng đầu tiên extend các matcher của jest-native vào Jest
- Phần mock console là optional, giúp test log không bị rối bởi warnings (như warning SafeAreaView deprecated)

---

## 🗂️ 4. Mock bắt buộc

### 📁 Tạo thư mục `__mocks__/` ở root

```
ReuseUni/
├── __mocks__/
│   ├── react-native-linear-gradient.js
│   └── fileMock.js
├── src/
├── jest.config.js
└── jest.setup.js
```

### 📄 **mocks**/react-native-linear-gradient.js

```javascript
import React from 'react';
import { View } from 'react-native';

// Mock LinearGradient component thành View đơn giản
export default props => <View {...props} />;
```

**Tại sao cần mock?**  
LinearGradient sử dụng native code, không thể chạy trong môi trường test. Ta mock nó thành View thông thường để test vẫn chạy được.

### 📄 **mocks**/fileMock.js

```javascript
// Mock for image assets - trả về string rỗng
module.exports = '';
```

**Tại sao cần mock?**  
Jest không thể import file ảnh trực tiếp. Ta mock chúng thành string để tránh lỗi.

---

## 🧪 5. Viết Tests

### Cấu trúc thư mục test

Quy ước: Đặt test file trong folder `__tests__/` cùng cấp với component.

```
src/
├── Home/
│   ├── HomeScreen.tsx
│   ├── HomeScreen.styles.ts
│   └── __tests__/
│       └── HomeScreen.test.tsx
├── Splash/
│   ├── SplashScreen.tsx
│   ├── SplashScreen.styles.ts
│   └── __tests__/
│       └── SplashScreen.test.tsx
```

---

### ✅ Test 1: SplashScreen

SplashScreen là màn hình đơn giản nhất, chỉ có logo và navigation khi nhấn.

#### 📄 src/Splash/**tests**/SplashScreen.test.tsx

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';

// Mock navigation
const mockNavigate = jest.fn();

// Mock LinearGradient (nếu SplashScreen dùng LinearGradient)
jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => <View {...props} />;
});

// Mock logo image
jest.mock('../../../assets/ic_reuseuni.png', () => 1);

describe('SplashScreen', () => {
  // Clear mocks trước mỗi test để các test độc lập
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render được màn hình không lỗi', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    expect(getByTestId('splash-root')).toBeTruthy();
  });

  it('hiển thị logo', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    expect(getByTestId('splash-logo')).toBeTruthy();
  });

  it('ấn vào màn hình → chuyển trang Waiting', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    fireEvent.press(getByTestId('splash-root'));

    expect(mockNavigate).toHaveBeenCalledWith('Waiting');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('logo có style được định nghĩa', () => {
    const { getByTestId } = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    );

    const logo = getByTestId('splash-logo');
    expect(logo.props.style).toBeDefined();
  });

  it('không crash khi navigation null', () => {
    expect(() => {
      render(<SplashScreen navigation={null as any} />);
    }).not.toThrow();
  });

  it('matches snapshot', () => {
    const tree = render(
      <SplashScreen navigation={{ navigate: mockNavigate } as any} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
```

**Giải thích flow:**

1. **Mock navigation:** Tạo function `mockNavigate` để spy khi component gọi `navigation.navigate()`
2. **Mock dependencies:** Mock LinearGradient và logo image
3. **beforeEach:** Clear mocks để mỗi test độc lập, không ảnh hưởng lẫn nhau
4. **Test cases:**
   - Test render cơ bản
   - Test logo hiển thị
   - Test navigation khi press
   - Test edge case (navigation null)
   - Test snapshot để đảm bảo UI không thay đổi ngoài ý muốn

---

### ✅ Test 2: HomeScreen

HomeScreen phức tạp hơn với nhiều chức năng: hiển thị products, search, navigation.

#### 📄 src/Home/**tests**/HomeScreen.test.tsx

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

const mockNavigate = jest.fn();

const mockNavigation: any = {
  navigate: mockNavigate,
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== BASIC RENDERING =====
  it('render được màn hình không lỗi', () => {
    const screen = render(<HomeScreen navigation={mockNavigation} />);
    expect(screen).toBeTruthy();
  });

  it('hiển thị tiêu đề "Shop"', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('Shop')).toBeTruthy();
  });

  // ===== PRODUCT LIST =====
  it('hiển thị danh sách sản phẩm', () => {
    const { getAllByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Kiểm tra có thông tin "sold" (nghĩa là có products)
    expect(getAllByText(/sold/i).length).toBeGreaterThan(0);
  });

  it('hiển thị giá sản phẩm', () => {
    const { getAllByText } = render(<HomeScreen navigation={mockNavigation} />);

    // Kiểm tra có format giá ($)
    const prices = getAllByText(/\$/);
    expect(prices.length).toBeGreaterThan(0);
  });

  // ===== NAVIGATION =====
  it('ấn nút search → chuyển trang Search', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    const searchBtn = getByTestId('floating-search-btn');
    fireEvent.press(searchBtn);

    expect(mockNavigate).toHaveBeenCalledWith('Search');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  // ===== SNAPSHOT =====
  it('matches snapshot', () => {
    const tree = render(<HomeScreen navigation={mockNavigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

**Giải thích:**

- Chia test thành sections (RENDERING, PRODUCT LIST, NAVIGATION) để dễ đọc
- Test case "hiển thị danh sách sản phẩm" dùng regex `/sold/i` để tìm text "sold" (case-insensitive)
- Test case "ấn nút search" kiểm tra cả việc navigate được gọi và số lần gọi
- Snapshot test để phát hiện UI changes không mong muốn

---

## 🔧 7. Thêm testID vào Components

Để test dễ dàng hơn, cần thêm `testID` prop vào các elements.

### SplashScreen.tsx

```typescript
import { TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ navigation }: any) => {
  const handlePress = () => {
    navigation.navigate('Waiting');
  };

  return (
    <TouchableOpacity
      testID="splash-root" // ← Thêm testID
      onPress={handlePress}
      style={styles.container}
    >
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <Image
          source={require('../../assets/ic_reuseuni.png')}
          testID="splash-logo" // ← Thêm testID
          style={styles.logo}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};
```

### HomeScreen.tsx

```typescript
<TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Search')}
        testID="floating-search-btn"
      >
```

**Quy tắc đặt testID:**

- **Containers:** `testID="screen-name"`
- **Buttons:** `testID="action-button"` (ví dụ: `search-button`)
- **List items:** `testID={item-${id}}` (dynamic - dùng template string)
- **Nested elements:** `testID={item-${id}-name}` (product name của item 1)

---

## 📊 8. Xem Coverage Report

Sau khi chạy `npm run test:coverage`, bạn sẽ thấy output trong terminal:

```
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |     100 |       75 |     100 |     100 |
 Home                    |     100 |       75 |     100 |     100 |
  HomeScreen.tsx         |     100 |       75 |     100 |     100 | 50
 Splash                  |     100 |      100 |     100 |     100 |
  SplashScreen.tsx       |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
```

## 🎯 Kết Quả Đạt Được

Với setup này, project của bạn đã có:

✅ **2 test suites:** HomeScreen và SplashScreen  
✅ **7 test cases** tổng cộng  
✅ **100% statement coverage** cho cả 2 screens  
✅ **100% function coverage**  
✅ **75% branch coverage** cho HomeScreen (có thể cải thiện)

**Warning SafeAreaView:**
