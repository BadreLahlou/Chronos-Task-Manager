package com.badrelahlou.taskmanager.service;

import com.badrelahlou.taskmanager.dto.TeamResponse;
import com.badrelahlou.taskmanager.model.Team;
import com.badrelahlou.taskmanager.model.User;
import com.badrelahlou.taskmanager.repository.TeamRepository;
import com.badrelahlou.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeamService {
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;

    public Team createTeam(String name, List<Long> memberIds) {
        if (teamRepository.existsByName(name)) {
            throw new RuntimeException("Team name already exists");
        }
        Team team = new Team();
        team.setName(name);
        List<User> members = userRepository.findAllById(memberIds);
        team.setMembers(members);
        return teamRepository.save(team);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }

    public Team updateTeam(Long id, String name, List<Long> memberIds) {
        Team team = teamRepository.findById(id).orElseThrow(() -> new RuntimeException("Team not found"));
        team.setName(name);
        List<User> members = userRepository.findAllById(memberIds);
        team.setMembers(members);
        return teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public TeamResponse toTeamResponse(Team team) {
        TeamResponse dto = new TeamResponse();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setMemberIds(team.getMembers().stream().map(User::getId).collect(Collectors.toList()));
        return dto;
    }
}
