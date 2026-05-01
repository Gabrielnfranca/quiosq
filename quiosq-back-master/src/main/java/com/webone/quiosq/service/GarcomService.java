package com.webone.quiosq.service;

import com.webone.quiosq.dto.GarcomDto;
import com.webone.quiosq.entity.Garcom;
import com.webone.quiosq.entity.Quiosque;
import com.webone.quiosq.repository.GarcomRepository;
import com.webone.quiosq.repository.MesaRepository;
import com.webone.quiosq.repository.QuiosqueRepository;
import com.webone.quiosq.entity.Mesa;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GarcomService {

    private final GarcomRepository garcomRepository;
    private final QuiosqueRepository quiosqueRepository;
    private final MesaRepository mesaRepository;

    public GarcomDto create(GarcomDto dto, UUID quiosqueId) {
        garcomRepository.findByCpfAndQuiosqueId(dto.getCpf(), quiosqueId)
            .ifPresent(g -> {
                throw new com.webone.quiosq.exception.ResourceDuplicateException("Já existe um garçom cadastrado com este CPF.");
            });

        Quiosque quiosque = quiosqueRepository.findById(quiosqueId)
            .orElseThrow(() -> new RuntimeException("Quiosque not found"));

        Garcom garcom = Garcom.builder()
            .nome(dto.getNome())
            .cpf(dto.getCpf())
            .status(true)
            .quiosque(quiosque)
            .build();

        Garcom saved = garcomRepository.save(garcom);
        return toDto(saved);
    }

    public Page<GarcomDto> findAllPageable(Integer page, Integer size, String orderBy, String direction, String search, UUID quiosqueId) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), orderBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Garcom> garcons;
        if (search != null && !search.isEmpty()) {
            garcons = garcomRepository.findByQuiosqueIdAndNomeContainingIgnoreCase(quiosqueId, search, pageable);
        } else {
            garcons = garcomRepository.findByQuiosqueId(quiosqueId, pageable);
        }
        
        return garcons.map(this::toDto);
    }

    public List<GarcomDto> findAllNotEqualsId(UUID quiosqueId, UUID garcomId) {
        return garcomRepository.findByQuiosqueIdAndIdNot(quiosqueId, garcomId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<GarcomDto> findAllWithStatusTrue(UUID quiosqueId) {
        return garcomRepository.findByQuiosqueIdAndStatusTrue(quiosqueId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void delete(UUID quiosqueId, UUID garcomId, UUID novoGarcomId) {
        Garcom garcom = garcomRepository.findById(garcomId).orElseThrow();
        
        if (garcom.getQuiosque().getId().equals(quiosqueId)) {
            if (novoGarcomId != null && !novoGarcomId.equals(garcomId)) {
                Garcom novoGarcom = garcomRepository.findById(novoGarcomId).orElseThrow();
                List<Mesa> mesasGarcomAntigo = mesaRepository.findByGarcomId(garcomId);
                for (Mesa mesa : mesasGarcomAntigo) {
                    mesa.setGarcom(novoGarcom);
                }
                mesaRepository.saveAll(mesasGarcomAntigo);
            } else {
                List<Mesa> mesasGarcomAntigo = mesaRepository.findByGarcomId(garcomId);
                for (Mesa mesa : mesasGarcomAntigo) {
                    mesa.setGarcom(null);
                }
                mesaRepository.saveAll(mesasGarcomAntigo);
            }
            garcomRepository.delete(garcom);
        }
    }

    public void activate(UUID garcomId) {
        Garcom garcom = garcomRepository.findById(garcomId).orElseThrow();
        garcom.setStatus(!garcom.getStatus());
        garcomRepository.save(garcom);
    }

    public GarcomDto update(GarcomDto dto) {
        Garcom garcom = garcomRepository.findById(dto.getId()).orElseThrow();
        garcomRepository.findByCpfAndQuiosqueId(dto.getCpf(), garcom.getQuiosque().getId())
            .ifPresent(existingGarcom -> {
                if (!existingGarcom.getId().equals(garcom.getId())) {
                    throw new com.webone.quiosq.exception.ResourceDuplicateException("Já existe outro garçom cadastrado com este CPF.");
                }
            });

        garcom.setNome(dto.getNome());
        garcom.setCpf(dto.getCpf());
        Garcom saved = garcomRepository.save(garcom);
        return toDto(saved);
    }

    private GarcomDto toDto(Garcom garcom) {
        return GarcomDto.builder()
            .id(garcom.getId())
            .nome(garcom.getNome())
            .cpf(garcom.getCpf())
            .status(garcom.getStatus())
            .build();
    }
}
