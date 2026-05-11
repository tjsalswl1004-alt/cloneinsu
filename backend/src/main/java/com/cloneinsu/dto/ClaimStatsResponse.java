package com.cloneinsu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ClaimStatsResponse {
    private final long totalAmount;
    private final long total;
    private final long sent;
    private final long paid;
    private final int completionRate;
}
