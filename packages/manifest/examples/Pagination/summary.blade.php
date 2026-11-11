<x-artisanpack-pagination
	:page="$page"
	:total="318"
	:per-page="10"
	summary
	:summary-label="__( 'Showing {from}–{to} of {total} properties' )"
	wire:page-change="$set( 'page', $event.detail.page )"
/>
