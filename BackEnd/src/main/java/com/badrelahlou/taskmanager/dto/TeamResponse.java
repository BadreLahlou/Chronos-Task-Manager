package com.badrelahlou.taskmanager.dto;

import java.util.List;

public class TeamResponse {
    private Long id;
    private String name;
    private List<Long> memberIds;
    // Optionally, add member names/emails for richer frontend display

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Long> getMemberIds() { return memberIds; }
    public void setMemberIds(List<Long> memberIds) { this.memberIds = memberIds; }
}
