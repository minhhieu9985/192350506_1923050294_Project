import {
  calculateSavings,
  calculateTargetDimensions,
} from '../../src/utils/imageCompression';

describe('Pure Logic: imageCompression utilities', () => {
  describe('calculateSavings', () => {
    it('returns zero savings when original size is 0', () => {
      const result = calculateSavings(0, 0);
      expect(result.savedBytes).toBe(0);
      expect(result.savedPercentage).toBe(0);
    });

    it('correctly calculates byte savings and percentage for phone photo', () => {
      // 4 MB down to 400 KB
      const originalBytes = 4 * 1024 * 1024;
      const compressedBytes = 400 * 1024;
      const result = calculateSavings(originalBytes, compressedBytes);

      expect(result.savedBytes).toBe(originalBytes - compressedBytes);
      expect(result.savedPercentage).toBe(90.2);
    });

    it('handles edge case where compressed is somehow larger without negative savings', () => {
      const result = calculateSavings(100, 150);
      expect(result.savedBytes).toBe(0);
      expect(result.savedPercentage).toBe(0);
    });
  });

  describe('calculateTargetDimensions', () => {
    it('keeps dimensions unchanged if smaller than max constraint (1080px)', () => {
      const result = calculateTargetDimensions(800, 600, 1080);
      expect(result.targetWidth).toBe(800);
      expect(result.targetHeight).toBe(600);
    });

    it('scales down landscape image correctly preserving aspect ratio', () => {
      // 4000x3000 (4:3 ratio) -> width 1080, height 810
      const result = calculateTargetDimensions(4000, 3000, 1080);
      expect(result.targetWidth).toBe(1080);
      expect(result.targetHeight).toBe(810);
    });

    it('scales down portrait image correctly preserving aspect ratio', () => {
      // 3000x4000 (3:4 ratio) -> height 1080, width 810
      const result = calculateTargetDimensions(3000, 4000, 1080);
      expect(result.targetWidth).toBe(810);
      expect(result.targetHeight).toBe(1080);
    });

    it('handles square images correctly', () => {
      const result = calculateTargetDimensions(2048, 2048, 1080);
      expect(result.targetWidth).toBe(1080);
      expect(result.targetHeight).toBe(1080);
    });
  });
});
