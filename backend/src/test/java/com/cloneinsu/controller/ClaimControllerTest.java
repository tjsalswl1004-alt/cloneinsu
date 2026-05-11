package com.cloneinsu.controller;

import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.dto.ClaimStatsResponse;
import com.cloneinsu.service.ClaimService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClaimController.class)
class ClaimControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClaimService claimService;

    @Test
    void getClaims_returns200() throws Exception {
        when(claimService.getClaims(null)).thenReturn(List.of());

        mockMvc.perform(get("/api/claims"))
               .andExpect(status().isOk())
               .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void getStats_returns200() throws Exception {
        when(claimService.getStats()).thenReturn(
            new ClaimStatsResponse(0L, 0L, 0L, 0L, 0)
        );

        mockMvc.perform(get("/api/claims/stats"))
               .andExpect(status().isOk());
    }
}
