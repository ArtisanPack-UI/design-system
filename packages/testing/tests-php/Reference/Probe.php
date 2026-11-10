<?php

/**
 * The reference Probe in Blade.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Testing\Tests\Reference;

use Illuminate\View\Component;

/**
 * A test-only button that proves the gates, with the same markup as the React
 * and Vue probes in test/reference.
 *
 * @since 1.0.0
 */
final class Probe extends Component
{
	/**
	 * Creates the probe.
	 *
	 * @since 1.0.0
	 *
	 * @param  string      $variant     Visual treatment.
	 * @param  string      $color       Semantic color.
	 * @param  string      $size        Control height.
	 * @param  bool        $disabled    Disables it.
	 * @param  bool        $loading     Shows the spinner.
	 * @param  string|null $leadingIcon Icon before the label.
	 */
	public function __construct(
		public string $variant = 'solid',
		public string $color = 'primary',
		public string $size = 'md',
		public bool $disabled = false,
		public bool $loading = false,
		public ?string $leadingIcon = null,
	) {
	}

	/**
	 * The template.
	 *
	 * @since 1.0.0
	 *
	 * @return string The inline Blade template.
	 */
	public function render(): string
	{
		return <<<'BLADE'
<button type="button" class="apui-probe" data-variant="{{ $variant }}" data-color="{{ $color }}" data-size="{{ $size }}" @if ( $disabled ) disabled data-disabled @endif @if ( $loading ) aria-busy="true" @endif x-on:click="$dispatch('press')">@if ( $leadingIcon )<span data-scope="probe" data-part="icon" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="5" fill="currentColor"></circle></svg></span>@endif<span data-scope="probe" data-part="label">{{ $slot }}</span>@if ( $loading )<span data-scope="probe" data-part="spinner" aria-hidden="true"></span>@endif</button>
BLADE;
	}
}
