package com.eshop.Eshop.model.dto.responsedto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResponseDto {
    private StoreDTO stores;
    private ProductResponseDTO products;
}
