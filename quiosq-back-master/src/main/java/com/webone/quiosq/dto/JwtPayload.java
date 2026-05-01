package com.webone.quiosq.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class JwtPayload {
    private String subject;
    private String role;
    private Integer mesaId;// cliente
    private UUID quiosqueId;      // escopo do cliente
    private List<String> roles = new ArrayList<>();     // admin/manager/garcom
    private List<UUID> quiosques = new ArrayList<>();   // escopos de admin

}
