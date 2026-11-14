<div aria-busy="true" style="display: grid; gap: 14px">
	@foreach ( range( 1, 3 ) as $row )
		<div style="display: flex; gap: 12px; align-items: center">
			<x-artisanpack-skeleton shape="circle" width="40px" height="40px" />
			<div style="flex: 1">
				<x-artisanpack-skeleton shape="text" width="50%" />
				<x-artisanpack-skeleton shape="text" width="80%" />
			</div>
		</div>
	@endforeach
</div>
