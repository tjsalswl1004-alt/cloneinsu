package com.cloneinsu.service;

import com.cloneinsu.dto.InsuranceCompanyResponse;
import com.cloneinsu.entity.InsuranceCompany;
import com.cloneinsu.repository.InsuranceCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InsuranceCompanyService {

    private final InsuranceCompanyRepository repository;

    public List<InsuranceCompanyResponse> getAll() {
        return repository.findAll().stream().map(InsuranceCompanyResponse::new).toList();
    }

    public List<InsuranceCompanyResponse> getByCategory(String category) {
        return repository.findByCategoryOrderByName(category).stream()
            .map(InsuranceCompanyResponse::new).toList();
    }

    public void seedIfEmpty() {
        if (repository.count() > 0) return;

        // { name, short, color, vfax, category }
        Object[][] companies = {
            // 손해보험
            {"AIG손해보험",     "AIG",  "#1B1B6E", false, "손해보험"},
            {"AXA손해보험",     "AXA",  "#00578A", true,  "손해보험"},
            {"DB손해보험",      "DB",   "#00843D", false, "손해보험"},
            {"KB손해보험",      "KB",   "#F5A623", false, "손해보험"},
            {"NH농협손해보험",  "NH",   "#00853F", false, "손해보험"},
            {"교직원공제",      "교직", "#003087", false, "손해보험"},
            {"라이나손해보험",  "라이", "#E31837", false, "손해보험"},
            {"롯데손해보험",    "롯데", "#E31837", false, "손해보험"},
            {"메리츠화재",      "메리", "#E31937", false, "손해보험"},
            {"삼성화재",        "삼성", "#1428A0", false, "손해보험"},
            {"새마을금고공제",  "새마", "#00843D", false, "손해보험"},
            {"수협공제",        "수협", "#0066CC", true,  "손해보험"},
            {"신한EZ손해보험",  "신한", "#0046FF", false, "손해보험"},
            {"신협공제",        "신협", "#0033A0", false, "손해보험"},
            {"예별손해보험",    "예별", "#E31837", false, "손해보험"},
            {"우체국보험",      "우체", "#E31837", false, "손해보험"},
            {"하나손해보험",    "하나", "#009B77", false, "손해보험"},
            {"한화손해보험",    "한화", "#FF6B35", false, "손해보험"},
            {"현대해상화재",    "현대", "#FF6600", false, "손해보험"},
            {"흥국화재",        "흥국", "#E31837", true,  "손해보험"},
            // 생명보험
            {"ABL생명",             "ABL",  "#E31837", false, "생명보험"},
            {"AIA생명",             "AIA",  "#D0021B", false, "생명보험"},
            {"BNP파리바카디프생명", "BNP",  "#00965E", false, "생명보험"},
            {"DB생명",              "DB",   "#00843D", false, "생명보험"},
            {"KB라이프생명",        "KB",   "#F5A623", false, "생명보험"},
            {"KDB생명",             "KDB",  "#00529B", false, "생명보험"},
            {"NH농협생명",          "NH",   "#00853F", false, "생명보험"},
            {"iM생명",              "iM",   "#0057A8", false, "생명보험"},
            {"교보라이프플래닛생명","교보", "#003087", false, "생명보험"},
            {"교보생명",            "교보", "#003087", true,  "생명보험"},
            {"동양생명",            "동양", "#0066CC", false, "생명보험"},
            {"라이나생명",          "라이", "#E31837", false, "생명보험"},
            {"메트라이프생명",      "Met",  "#0066CC", true,  "생명보험"},
            {"미래에셋생명",        "미래", "#E31837", true,  "생명보험"},
            {"삼성생명",            "삼성", "#1428A0", true,  "생명보험"},
            {"신한라이프",          "신한", "#0046FF", true,  "생명보험"},
            {"오렌지라이프",        "OL",   "#FF6600", true,  "생명보험"},
            {"처브라이프생명",      "CB",   "#E31837", false, "생명보험"},
            {"푸르덴셜생명",        "PR",   "#003087", false, "생명보험"},
            {"푸본현대생명",        "푸본", "#E31837", false, "생명보험"},
            {"하나생명",            "하나", "#009B77", false, "생명보험"},
            {"한화생명",            "한화", "#E31837", true,  "생명보험"},
            {"흥국생명",            "흥국", "#E31837", true,  "생명보험"},
            // 배상책임
            {"AIG손해보험",    "AIG",  "#1B1B6E", false, "배상책임"},
            {"AXA손해보험",    "AXA",  "#00578A", true,  "배상책임"},
            {"DB손해보험",     "DB",   "#00843D", false, "배상책임"},
            {"KB손해보험",     "KB",   "#F5A623", false, "배상책임"},
            {"NH농협손해보험", "NH",   "#00853F", false, "배상책임"},
            {"롯데손해보험",   "롯데", "#E31837", false, "배상책임"},
            {"메리츠화재",     "메리", "#E31937", false, "배상책임"},
            {"삼성화재",       "삼성", "#1428A0", false, "배상책임"},
            {"예별손해보험",   "예별", "#E31837", false, "배상책임"},
            {"하나손해보험",   "하나", "#009B77", false, "배상책임"},
            {"한화손해보험",   "한화", "#FF6B35", false, "배상책임"},
            {"현대해상화재",   "현대", "#FF6600", false, "배상책임"},
            {"흥국화재",       "흥국", "#E31837", true,  "배상책임"},
        };

        for (Object[] c : companies) {
            repository.save(InsuranceCompany.builder()
                .name((String) c[0])
                .shortName((String) c[1])
                .color((String) c[2])
                .vfax((Boolean) c[3])
                .category((String) c[4])
                .build());
        }
    }
}
