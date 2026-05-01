package com.webone.quiosq.controller;

import com.webone.quiosq.dto.GarcomDto;
import com.webone.quiosq.service.GarcomService;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/admin/garcom")
public class GarcomController {

    private final GarcomService garcomService;

    @PostMapping("/{quiosqueId}")
    public ResponseEntity<GarcomDto> create(@RequestBody GarcomDto garcomDto, @PathVariable UUID quiosqueId) {
        return new ResponseEntity<>(garcomService.create(garcomDto, quiosqueId), HttpStatus.CREATED);
    }

    @GetMapping("/{quiosqueId}/pageable")
    public ResponseEntity<Page<GarcomDto>> findAllPageable(
        @PathVariable UUID quiosqueId,
        @RequestParam(value = "page", defaultValue = "0") Integer page,
        @RequestParam(value = "size", defaultValue = "10") Integer size,
        @RequestParam(value = "orderBy", defaultValue = "nome") String orderBy,
        @RequestParam(value = "direction", defaultValue = "DESC") String direction,
        @RequestParam(value = "search", required = false) String search
    ) {
        return new ResponseEntity<>(garcomService.findAllPageable(page, size, orderBy, direction, search, quiosqueId), HttpStatus.OK);
    }

    @GetMapping("/findAllNotEquals/{quiosqueId}/{garcomId}")
    public ResponseEntity<List<GarcomDto>> findAllNotEqualsId(@PathVariable UUID quiosqueId, @PathVariable UUID garcomId) {
        return new ResponseEntity<>(garcomService.findAllNotEqualsId(quiosqueId, garcomId), HttpStatus.OK);
    }

    @GetMapping("/findAllWithStatusTrue/{quiosqueId}")
    public ResponseEntity<List<GarcomDto>> findAllWithStatusTrue(@PathVariable UUID quiosqueId) {
        return new ResponseEntity<>(garcomService.findAllWithStatusTrue(quiosqueId), HttpStatus.OK);
    }

    @DeleteMapping({"/{quiosqueId}/{garcomId}/{novoGarcomId}", "/{quiosqueId}/{garcomId}"})
    public ResponseEntity<Void> delete(@PathVariable UUID quiosqueId, @PathVariable UUID garcomId, @PathVariable(required = false) UUID novoGarcomId) {
        garcomService.delete(quiosqueId, garcomId, novoGarcomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/activate")
    public ResponseEntity<Void> activate(@RequestBody Map<String, String> payload) {
        garcomService.activate(UUID.fromString(payload.get("id")));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<GarcomDto> update(@RequestBody GarcomDto garcomDto) {
        return new ResponseEntity<>(garcomService.update(garcomDto), HttpStatus.OK);
    }
}
