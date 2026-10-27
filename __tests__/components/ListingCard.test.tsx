import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ListingCard } from '../../src/components/listing/ListingCard';
import { Listing } from '../../src/types';

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

const mockListing: Listing = {
  id: 'test_1',
  sellerId: 's1',
  sellerName: 'Nguyễn Văn A',
  title: 'Giáo trình Giải tích 1',
  description: 'Tình trạng còn rất mới',
  category: 'Textbooks',
  price: 50000,
  originalPrice: 70000,
  stock: 3,
  photoUri: 'https://example.com/math.jpg',
  createdAt: '2026-10-25T10:00:00Z',
};

describe('Component Test: ListingCard', () => {
  it('renders title, category, seller and formatted price properly', async () => {
    const onPress = jest.fn();
    await render(<ListingCard listing={mockListing} onPress={onPress} />);

    expect(screen.getByText('Giáo trình Giải tích 1')).toBeTruthy();
    expect(screen.getByText('Textbooks')).toBeTruthy();
    expect(screen.getByText(/Nguyễn Văn A/)).toBeTruthy();
    expect(screen.getByText('50.000 đ')).toBeTruthy();
    expect(screen.getByText('70.000 đ')).toBeTruthy();
  });

  it('triggers onPress when clicking the card', async () => {
    const onPress = jest.fn();
    await render(<ListingCard listing={mockListing} onPress={onPress} />);

    const cardButton = screen.getByRole('button', { name: /Giáo trình Giải tích 1/i });
    fireEvent.press(cardButton);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows out of stock overlay when stock is 0', async () => {
    const outOfStockListing = { ...mockListing, stock: 0 };
    await render(<ListingCard listing={outOfStockListing} onPress={jest.fn()} />);

    expect(screen.getByText('Hết hàng')).toBeTruthy();
  });

  it('triggers favourite toggle callback when clicking heart icon', async () => {
    const onToggleFavourite = jest.fn();
    await render(
      <ListingCard
        listing={mockListing}
        onPress={jest.fn()}
        onToggleFavourite={onToggleFavourite}
      />
    );

    const favButton = screen.getByLabelText(/Thêm Giáo trình Giải tích 1 vào mục yêu thích/i);
    fireEvent.press(favButton);
    expect(onToggleFavourite).toHaveBeenCalledTimes(1);
  });
});
