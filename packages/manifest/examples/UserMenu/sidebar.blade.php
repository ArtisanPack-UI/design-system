<x-artisanpack-user-menu
	:user="[ 'name' => $user->name, 'email' => $user->email, 'avatar' => $user->avatar_url, 'role' => $user->role_label ]"
	:workspaces="$workspaces"
	:workspace="$currentWorkspace"
	:items="[ [ 'value' => 'profile', 'label' => __( 'Profile' ), 'icon' => 'user' ], [ 'value' => 'settings', 'label' => __( 'Settings' ), 'icon' => 'settings' ] ]"
	:logout-action="route( 'logout' )"
	wire:workspace-change="switchWorkspace( $event.detail.value )"
	wire:select="go( $event.detail.value )"
/>
