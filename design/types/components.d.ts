// ArtisanPack UI component props — documentation, shared by the Livewire, React and Vue packages.
// Each prop maps to a data-* attribute styled by bundle.css.

export type Color = 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
export interface MenuItem { type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'label'; label?: string; icon?: string; shortcut?: string; checked?: boolean; color?: 'error'; disabled?: boolean; }
export interface TableColumn { key: string; label: string; numeric?: boolean; sortable?: boolean; }

export interface ButtonProps {
  /** Default: solid. */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
  /** Default: primary. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** Default: md. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Default: false. */
  iconOnly?: boolean;
  /** Default: false. */
  loading?: boolean;
  /** Default: false. */
  disabled?: boolean;
  href?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface InputProps {
  label?: string;
  hint?: string;
  error?: string | boolean;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: string;
  trailingIcon?: string;
  prefix?: string;
  suffix?: string;
  /** Default: false. */
  required?: boolean;
  /** Default: false. */
  disabled?: boolean;
  /** Default: false. */
  readOnly?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface SelectProps {
  label?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  placeholder?: string;
  /** Default: false. */
  searchable?: boolean;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  error?: string | boolean;
  /** Default: false. */
  disabled?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface TextareaProps {
  label?: string;
  /** Default: 4. */
  rows?: number;
  maxLength?: number;
  /** Default: false. */
  autoResize?: boolean;
  hint?: string;
  error?: string | boolean;
  /** Default: false. */
  disabled?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface CheckboxProps {
  /** Default: false. */
  checked?: boolean | 'indeterminate';
  label?: string;
  description?: string;
  /** Default: false. */
  invalid?: boolean;
  /** Default: false. */
  disabled?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface RadioGroupProps {
  legend?: string;
  options?: Array<{ value: string; label: string; description?: string; meta?: string; disabled?: boolean }>;
  value?: string;
  /** Default: vertical. */
  orientation?: 'vertical' | 'horizontal';
  /** Default: default. */
  variant?: 'default' | 'cards';
  /** Default: false. */
  invalid?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface ToggleProps {
  /** Default: false. */
  checked?: boolean;
  label?: string;
  description?: string;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  /** Default: primary. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** Default: false. */
  disabled?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface DatePickerProps {
  label?: string;
  /** Default: single. */
  mode?: 'single' | 'range';
  value?: string | [string, string];
  min?: string;
  max?: string;
  disabledDates?: string[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  error?: string | boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface CardProps {
  /** Default: default. */
  surface?: 'default' | 'raised' | 'sunken' | 'glass';
  /** Default: false. */
  interactive?: boolean;
  title?: string;
  description?: string;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface DialogProps {
  /** Default: false. */
  open?: boolean;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  /** Default: dialog. */
  role?: 'dialog' | 'alertdialog';
  /** Default: overlay. */
  surface?: 'overlay' | 'glass';
  title?: string;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface DropdownMenuProps {
  items?: Array<MenuItem>;
  /** Default: start. */
  align?: 'start' | 'center' | 'end';
  /** Default: overlay. */
  surface?: 'overlay' | 'glass';
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface ToastProps {
  title?: string;
  description?: string;
  /** Default: neutral. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** Default: default. */
  variant?: 'default' | 'inverse';
  /** Default: overlay. */
  surface?: 'overlay' | 'glass';
  /** Default: 5000. */
  duration?: number;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface AlertProps {
  title?: string;
  description?: string;
  /** Default: neutral. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** Default: soft. */
  variant?: 'soft' | 'outline' | 'solid';
  surface?: 'glass';
  /** Default: false. */
  dismissible?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface BadgeProps {
  /** Default: soft. */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  /** Default: neutral. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  /** Default: false. */
  dot?: boolean;
  icon?: string;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface AvatarProps {
  name?: string;
  src?: string;
  /** Default: md. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Default: circle. */
  shape?: 'circle' | 'square';
  /** Default: neutral. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  status?: 'online' | 'away' | 'offline';
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface StatProps {
  label?: string;
  value?: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  /** Default: false. */
  emphasis?: boolean;
  /** Default: neutral. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  icon?: string;
  /** Default: false. */
  bare?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface TableProps {
  columns?: Array<TableColumn>;
  rows?: Array<Record<string, unknown>>;
  /** Default: default. */
  density?: 'compact' | 'default' | 'comfortable';
  /** Default: false. */
  selectable?: boolean;
  /** Default: true. */
  stickyHeader?: boolean;
  /** Default: default. */
  surface?: 'default' | 'glass';
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface TabsProps {
  items?: Array<{ value: string; label: string; count?: number; disabled?: boolean }>;
  value?: string;
  /** Default: segmented. */
  variant?: 'segmented' | 'underline';
  /** Default: md. */
  size?: 'sm' | 'md';
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface PaginationProps {
  page?: number;
  pageCount?: number;
  /** Default: 1. */
  siblings?: number;
  /** Default: false. */
  showSummary?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface BreadcrumbsProps {
  items?: Array<{ label: string; href?: string }>;
  /** Default: 4. */
  maxItems?: number;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface NavbarProps {
  /** Default: bar. */
  layout?: 'bar' | 'island';
  /** Default: default. */
  surface?: 'default' | 'glass';
  /** Default: true. */
  sticky?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface AppShellProps {
  /** Default: false. */
  collapsed?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface PageHeaderProps {
  title?: string;
  description?: string;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

export interface ChartProps {
  type?: 'bar' | 'line' | 'area' | 'donut';
  series?: Array<{ name: string; data: number[] }>;
  labels?: string[];
  /** Default: false. */
  showTable?: boolean;
  /** Extra classes per part, e.g. { root: "...", label: "..." }. */
  classes?: Partial<Record<string, string>>;
}

// ---- Extended components ----
export interface MenuNode { label: string; href?: string; icon?: string; badge?: string; children?: MenuNode[]; }

export interface ComboboxProps {
  options?: Array<{ value: string; label: string; description?: string }>;
  /** Default: false. */
  allowCreate?: boolean;
  /** Default: false. */
  async?: boolean;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  classes?: Partial<Record<string, string>>;
}

export interface TagsProps {
  value?: string[];
  suggestions?: string[];
  max?: number;
  /** Default: 'neutral'. */
  color?: Color;
  classes?: Partial<Record<string, string>>;
}

export interface PasswordProps {
  /** Default: false. */
  showStrength?: boolean;
  requirements?: Array<{label, test}>;
  /** Default: current-password. */
  autocomplete?: 'current-password' | 'new-password';
  classes?: Partial<Record<string, string>>;
}

export interface PinProps {
  /** Default: 6. */
  length?: number;
  /** Default: false. */
  mask?: boolean;
  /** Default: numeric. */
  type?: 'numeric' | 'alphanumeric';
  /** Default: md. */
  size?: 'sm' | 'md';
  classes?: Partial<Record<string, string>>;
}

export interface CheckboxGroupProps {
  options?: Array<{ value: string; label: string; description?: string }>;
  value?: string[];
  /** Default: 1. */
  columns?: 1 | 2 | 3;
  /** Default: vertical. */
  orientation?: 'vertical' | 'horizontal';
  /** Default: default. */
  variant?: 'default' | 'cards';
  /** Default: false. */
  invalid?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface SelectGroupProps {
  groups?: Array<{label, options}>;
  /** Default: false. */
  attached?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface RangeProps {
  /** Default: 0 · 100 · 1. */
  min?: number;
  /** Default: 0 · 100 · 1. */
  max?: number;
  /** Default: 0 · 100 · 1. */
  step?: number;
  value?: number | [number, number];
  /** Default: focus. */
  showValue?: 'never' | 'focus' | 'always';
  marks?: Array<{ value: number; label: string }>;
  /** Default: primary. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  classes?: Partial<Record<string, string>>;
}

export interface RatingProps {
  value?: number;
  /** Default: true. */
  readOnly?: boolean;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  count?: number;
  classes?: Partial<Record<string, string>>;
}

export interface ColorPickerProps {
  value?: string;
  /** Default: hex. */
  format?: 'hex' | 'rgb' | 'hsl' | 'oklch';
  /** Default: true. */
  alpha?: boolean;
  swatches?: string[];
  classes?: Partial<Record<string, string>>;
}

export interface FileProps {
  accept?: string;
  /** Default: false. */
  multiple?: boolean;
  maxSize?: number;
  /** Default: dropzone. */
  variant?: 'dropzone' | 'compact';
  classes?: Partial<Record<string, string>>;
}

export interface FieldsetProps {
  /** Default: panel. */
  variant?: 'panel' | 'divided' | 'plain';
  /** Default: false. */
  disabled?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface ValidationSummaryProps {
  errors?: Array<{field, message}>;
  /** Default: error. */
  color?: 'error' | 'warning';
  classes?: Partial<Record<string, string>>;
}

export interface SignatureProps {
  /** Default: draw. */
  mode?: 'draw' | 'type' | 'upload';
  /** Default: text. */
  penColor?: string;
  /** Default: false. */
  required?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface DateTimeProps {
  value?: string;
  /** Default: 30. */
  step?: number;
  /** Default: local. */
  timeZone?: string;
  classes?: Partial<Record<string, string>>;
}

export interface RichTextEditorProps {
  /** Default: default. */
  toolbar?: string | string[];
  maxLength?: number;
  /** Default: html. */
  output?: 'html' | 'markdown' | 'json';
  classes?: Partial<Record<string, string>>;
}

export interface CodeEditorProps {
  language?: string;
  /** Default: false. */
  readOnly?: boolean;
  diagnostics?: Array<{line, message, severity}>;
  classes?: Partial<Record<string, string>>;
}

export interface MarkdownProps {
  source?: string;
  /** Default: preview. */
  mode?: 'preview' | 'write' | 'split';
  /** Default: true. */
  sanitize?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface CodeProps {
  language?: string;
  /** Default: false. */
  numbered?: boolean;
  highlight?: number[];
  fileName?: string;
  classes?: Partial<Record<string, string>>;
}

export interface KbdProps {
  keys?: string[];
  /** Default: md. */
  size?: 'sm' | 'md';
  classes?: Partial<Record<string, string>>;
}

export interface ClipboardProps {
  value?: string;
  /** Default: 2000. */
  timeout?: number;
  classes?: Partial<Record<string, string>>;
}

export interface DiffProps {
  /** Default: unified. */
  view?: 'unified' | 'split';
  /** Default: true. */
  wordLevel?: boolean;
  /** Default: 3. */
  context?: number;
  classes?: Partial<Record<string, string>>;
}

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  classes?: Partial<Record<string, string>>;
}

export interface TextProps {
  /** Default: md. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'lead';
  /** Default: default. */
  tone?: 'default' | 'muted' | 'success' | 'warning' | 'error';
  /** Default: regular. */
  weight?: 'regular' | 'medium' | 'semibold';
  truncate?: boolean | number;
  clamp?: boolean | number;
  classes?: Partial<Record<string, string>>;
}

export interface LinkProps {
  /** Default: primary. */
  tone?: 'primary' | 'muted';
  /** Default: false. */
  standalone?: boolean;
  /** Default: false. */
  external?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface DividerProps {
  /** Default: horizontal. */
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  /** Default: subtle. */
  strength?: 'subtle' | 'strong';
  classes?: Partial<Record<string, string>>;
}

export interface IconProps {
  name?: string;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  /** Default: auto. */
  mirror?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface MenuProps {
  items?: Array<MenuNode>;
  /** Default: true. */
  collapsible?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface StepsProps {
  steps?: Array<{title, description?, state}>;
  /** Default: horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** Default: false. */
  clickable?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface SpotlightProps {
  groups?: Array<{label, items}>;
  /** Default: ⌘K. */
  shortcut?: string;
  /** Default: true. */
  recent?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface AccordionProps {
  /** Default: single. */
  type?: 'single' | 'multiple';
  /** Default: default. */
  variant?: 'default' | 'separated' | 'flush';
  defaultOpen?: string[];
  classes?: Partial<Record<string, string>>;
}

export interface CollapseProps {
  /** Default: false. */
  open?: boolean;
  /** Default: section. */
  variant?: 'section' | 'read-more';
  classes?: Partial<Record<string, string>>;
}

export interface DrawerProps {
  /** Default: end. */
  side?: 'end' | 'start' | 'bottom';
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  /** Default: true. */
  modal?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface PopoverProps {
  /** Default: bottom. */
  placement?: 'top' | 'bottom' | 'start' | 'end';
  /** Default: true. */
  arrow?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface TooltipProps {
  content?: string;
  /** Default: top. */
  placement?: 'top' | 'bottom' | 'start' | 'end';
  /** Default: 400. */
  delay?: number;
  classes?: Partial<Record<string, string>>;
}

export interface UserMenuProps {
  user?: { name: string; email: string; avatar?: string };
  workspaces?: Array<{ id: string; name: string }>;
  /** Default: true. */
  showTheme?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface LoadingProps {
  /** Default: md. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Default: Loading. */
  label?: string;
  /** Default: 300. */
  delay?: number;
  classes?: Partial<Record<string, string>>;
}

export interface ProgressProps {
  value?: number;
  /** Default: 100. */
  max?: number;
  /** Default: false. */
  indeterminate?: boolean;
  /** Default: md. */
  size?: 'sm' | 'md' | 'lg';
  /** Default: primary. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  classes?: Partial<Record<string, string>>;
}

export interface ProgressRadialProps {
  value?: number;
  /** Default: 64. */
  size?: number;
  /** Default: 6. */
  thickness?: number;
  /** Default: primary. */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  classes?: Partial<Record<string, string>>;
}

export interface StreamableContentProps {
  /** Default: streaming. */
  state?: 'waiting' | 'streaming' | 'done' | 'error' | 'stopped';
  onStop?: () => void;
  classes?: Partial<Record<string, string>>;
}

export interface SkeletonProps {
  /** Default: block. */
  shape?: 'block' | 'text' | 'circle';
  width?: string;
  height?: string;
  classes?: Partial<Record<string, string>>;
}

export interface EmptyStateProps {
  /** Default: first-use. */
  variant?: 'first-use' | 'no-results' | 'cleared';
  /** Default: md. */
  size?: 'sm' | 'md';
  /** Default: center. */
  align?: 'center' | 'start';
  classes?: Partial<Record<string, string>>;
}

export interface ErrorStateProps {
  /** Default: request. */
  variant?: 'request' | 'offline' | 'not-found' | 'forbidden';
  code?: string;
  classes?: Partial<Record<string, string>>;
}

export interface SparklineProps {
  data?: number[];
  /** Default: line. */
  kind?: 'line' | 'area' | 'bar';
  /** Default: 96 · 28. */
  width?: number;
  /** Default: 96 · 28. */
  height?: number;
  classes?: Partial<Record<string, string>>;
}

export interface KpiCardProps {
  stat?: StatProps;
  trend?: number[];
  target?: { value: number; label: string };
  period?: string;
  classes?: Partial<Record<string, string>>;
}

export interface TimelineProps {
  items?: Array<{icon?, color?, title, time, body?}>;
  /** Default: icon. */
  variant?: 'icon' | 'dot';
  classes?: Partial<Record<string, string>>;
}

export interface ListItemProps {
  /** Default: false. */
  interactive?: boolean;
  /** Default: false. */
  selected?: boolean;
  /** Default: false. */
  disabled?: boolean;
  /** Default: plain. */
  variant?: 'plain' | 'bordered' | 'divided';
  classes?: Partial<Record<string, string>>;
}

export interface CalendarProps {
  /** Default: month. */
  view?: 'month' | 'week' | 'day' | 'agenda';
  events?: Array<{start, end?, title, color}>;
  /** Default: locale. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  classes?: Partial<Record<string, string>>;
}

export interface ImageGalleryProps {
  images?: Array<{src, alt, caption?}>;
  /** Default: 4. */
  columns?: number;
  /** Default: false. */
  featured?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface ImageLibraryProps {
  /** Default: grid. */
  view?: 'grid' | 'list';
  /** Default: multiple. */
  selectable?: 'single' | 'multiple';
  accept?: string;
  classes?: Partial<Record<string, string>>;
}

export interface CarouselProps {
  /** Default: 1. */
  perView?: number;
  /** Default: false. */
  loop?: boolean;
  /** Default: false. */
  autoplay?: boolean;
  classes?: Partial<Record<string, string>>;
}

export interface ImageSliderProps {
  images?: Array<{src, alt, caption?}>;
  /** Default: 21 / 9. */
  aspectRatio?: string;
  classes?: Partial<Record<string, string>>;
}

export interface ThemeToggleProps {
  /** Default: system. */
  value?: 'light' | 'dark' | 'high-contrast' | 'system';
  /** Default: segmented. */
  variant?: 'segmented' | 'icon' | 'menu';
  classes?: Partial<Record<string, string>>;
}

export interface ThemePreviewProps {
  options?: Array<{value, label, theme?, preset?}>;
  value?: string;
  classes?: Partial<Record<string, string>>;
}
