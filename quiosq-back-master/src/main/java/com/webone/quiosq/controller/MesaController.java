package com.webone.quiosq.controller;

import com.webone.quiosq.dto.MesaDto;
import com.webone.quiosq.service.MesaService;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/admin/mesa")
@AllArgsConstructor
public class MesaController {

    private final MesaService mesaService;
    private final com.webone.quiosq.repository.MesaRepository mesaRepository;

    @GetMapping("/debug")
    public ResponseEntity<java.util.List<Object>> debugMesasTodas() {
        java.util.List<com.webone.quiosq.entity.Mesa> mesas = mesaRepository.findAll();
        java.util.List<Object> res = new java.util.ArrayList<>();
        for (com.webone.quiosq.entity.Mesa m : mesas) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("numero", m.getNumero());
            map.put("status", m.getStatus());
            map.put("garcomId", m.getGarcom() != null ? m.getGarcom().getId() : null);
            map.put("garcomNome", m.getGarcom() != null ? m.getGarcom().getNome() : null);
            map.put("quiosqueId", m.getQuiosque().getId());
            res.add(map);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{quiosqueId}/debug")
    public ResponseEntity<java.util.List<Object>> debugMesas(@PathVariable UUID quiosqueId) {
        java.util.List<com.webone.quiosq.entity.Mesa> mesas = mesaRepository.findAll();
        java.util.List<Object> res = new java.util.ArrayList<>();
        for (com.webone.quiosq.entity.Mesa m : mesas) {
            if (m.getQuiosque().getId().equals(quiosqueId)) {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("numero", m.getNumero());
                map.put("status", m.getStatus());
                map.put("garcomId", m.getGarcom() != null ? m.getGarcom().getId() : null);
                map.put("garcomNome", m.getGarcom() != null ? m.getGarcom().getNome() : null);
                res.add(map);
            }
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{quiosqueId}/pageable")
    public ResponseEntity<Page<MesaDto>> findAllPageable(
        @PathVariable UUID quiosqueId,
        @RequestParam Map<String, String> params) {
        
        return ResponseEntity.ok(mesaService.findAllPageable(params, quiosqueId));
    }

    @PostMapping("/{quiosqueId}")
    public ResponseEntity<MesaDto> create(
        @PathVariable UUID quiosqueId,
        @RequestBody MesaDto mesaDto) {
        
        return ResponseEntity.status(HttpStatus.CREATED).body(mesaService.create(mesaDto, quiosqueId));
    }

    @PostMapping("/{quiosqueId}/lote")
    public ResponseEntity<java.util.List<MesaDto>> createLote(
        @PathVariable UUID quiosqueId,
        @RequestBody com.webone.quiosq.dto.MesaLoteDto mesaLoteDto) {
        
        return ResponseEntity.status(HttpStatus.CREATED).body(mesaService.createLote(mesaLoteDto, quiosqueId));
    }

    @PutMapping("/update")
    public ResponseEntity<MesaDto> update(@RequestBody MesaDto mesaDto) {
        return ResponseEntity.ok(mesaService.update(mesaDto));
    }

    @DeleteMapping("/{mesaId}")
    public ResponseEntity<Void> delete(@PathVariable UUID mesaId) {
        mesaService.delete(mesaId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/activate")
    public ResponseEntity<Void> activate(@RequestBody MesaDto mesaDto) {
        mesaService.activate(mesaDto.getId());
        return ResponseEntity.noContent().build();
    }
        @DeleteMapping("/{quiosqueId}/all")
    public ResponseEntity<Void> deleteAll(@PathVariable UUID quiosqueId) {
        mesaService.deleteAllByQuiosque(quiosqueId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/delete-batch")
    public ResponseEntity<Void> deleteBatch(@RequestBody java.util.List<UUID> ids) {
        mesaService.deleteBatch(ids);
        return ResponseEntity.noContent().build();
    }
}

