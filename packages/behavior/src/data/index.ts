/**
 * The data-display helpers (#61): Sparkline geometry and the Diff
 * component's line and word diff. Not Zag machines: plain functions React
 * and Vue call directly, so both draw the same markup; Livewire UI
 * Components ports them to PHP.
 */
export {
  SPARKLINE_HEIGHT,
  SPARKLINE_LABEL,
  SPARKLINE_WIDTH,
  sparklineGeometry,
  sparklineLabel,
  sparklineValues,
  type SparklineBar,
  type SparklineGeometry,
  type SparklineVariant,
} from './sparkline';
export {
  DIFF_COUNTS_LABEL,
  DIFF_EMPTY_LABEL,
  diffCountsLabel,
  diffLinesOf,
  diffText,
  diffTokens,
  splitRows,
  wordDiff,
  type DiffHunk,
  type DiffLine,
  type DiffLineType,
  type DiffOptions,
  type DiffResult,
  type DiffSegment,
  type DiffSide,
  type DiffSplitRow,
} from './diff';
