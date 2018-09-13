package com.praksa.breza.repository;

import com.praksa.breza.domain.OnlineOrderItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the OnlineOrderItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OnlineOrderItemRepository extends JpaRepository<OnlineOrderItem, Long> {
    public List<OnlineOrderItem> findByOnlineOrderId(Long OnlineOrderId);
}
