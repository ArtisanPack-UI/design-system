{{-- routes/web.php: the endpoint returns groups ({ label, items }) or a flat list of items. --}}
{{--
Route::get( '/spotlight', function ( Request $request ) {
	$listings = Listing::query()->where( 'title', 'like', '%' . $request->string( 'search' ) . '%' )->limit( 8 )->get();

	return [
		[
			'label' => __( 'Listings' ),
			'items' => $listings->map( fn ( Listing $listing ) => [
				'label'       => $listing->title,
				'description' => $listing->city,
				'href'        => route( 'listings.show', $listing ),
				'icon'        => 'house',
			] ),
		],
	];
} )->name( 'spotlight' );
--}}

<x-artisanpack-spotlight
	:url="route( 'spotlight' )"
	:placeholder="__( 'Search listings…' )"
	:empty-label="__( 'No listings match.' )"
/>
