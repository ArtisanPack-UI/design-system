<x-artisanpack-validation-summary
    color="warning"
    :errors="[
        [ 'field' => 'description', 'message' => __( 'Description is shorter than 80 characters.' ) ],
        [ 'field' => 'floor-plan', 'message' => __( 'No floor plan uploaded.' ) ],
    ]"
/>
