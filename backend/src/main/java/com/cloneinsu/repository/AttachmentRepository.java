package com.cloneinsu.repository;

import com.cloneinsu.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByClaimId(Long claimId);
}
