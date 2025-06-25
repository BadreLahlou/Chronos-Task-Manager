package com.badrelahlou.taskmanager.repository;

import com.badrelahlou.taskmanager.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByName(String name);
}
