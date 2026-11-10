<?php

/**
 * The broken reference Probe in Blade.
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
 * Ignores size, loading and leadingIcon, declares `tone`, dispatches `click`
 * and renders a part the manifest doesn't list: the drift the parity checks
 * must report, the same as the React and Vue twins.
 *
 * @since 1.0.0
 */
final class BrokenProbe extends Component
{
	/**
	 * Creates the probe.
	 *
	 * @since 1.0.0
	 *
	 * @param  string      $variant  Visual treatment.
	 * @param  string      $color    Semantic color.
	 * @param  string      $size     Ignored.
	 * @param  bool        $disabled Disables it.
	 * @param  string|null $tone     Not in the manifest.
	 */
	public function __construct(
		public string $variant = 'solid',
		public string $color = 'primary',
		public string $size = 'md',
		public bool $disabled = false,
		public ?string $tone = null,
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
<button type="button" class="apui-probe" data-variant="{{ $variant }}" data-color="{{ $color }}" data-size="md" @if ( $disabled ) disabled @endif x-on:click="$dispatch('click')"><span data-scope="probe" data-part="label">{{ $slot }}</span><span data-scope="probe" data-part="badge"></span></button>
BLADE;
	}
}
