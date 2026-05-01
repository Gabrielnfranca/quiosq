package com.webone.quiosq.service;

import com.webone.quiosq.dto.MesaDto;
import com.webone.quiosq.entity.Garcom;
import com.webone.quiosq.entity.Mesa;
import com.webone.quiosq.entity.Quiosque;
import com.webone.quiosq.repository.GarcomRepository;
import com.webone.quiosq.repository.MesaRepository;
import com.webone.quiosq.repository.QuiosqueRepository;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class MesaService {

    private final MesaRepository mesaRepository;
    private final QuiosqueRepository quiosqueRepository;
    private final GarcomRepository garcomRepository;

    public Page<MesaDto> findAllPageable(Map<String, String> requestParams, UUID quiosqueId) {
        int page = requestParams.containsKey("page") ? Integer.parseInt(requestParams.get("page")) : 0;
        int size = requestParams.containsKey("size") ? Integer.parseInt(requestParams.get("size")) : 10;
        String searchTerm = requestParams.get("search");

        Pageable pageable = PageRequest.of(page, size, Sort.by("numero").ascending());

        Page<Mesa> mesas;
        if (searchTerm != null && !searchTerm.isEmpty()) {
            Integer numero = Integer.parseInt(searchTerm);
            mesas = mesaRepository.findByQuiosqueIdAndNumero(quiosqueId, numero, pageable);
        } else {
            mesas = mesaRepository.findByQuiosqueId(quiosqueId, pageable);
        }

        return mesas.map(mesa -> MesaDto.builder()
            .id(mesa.getId())
            .numero(mesa.getNumero())
            .status(mesa.getStatus())
            .garcomId(mesa.getGarcom() != null ? mesa.getGarcom().getId() : null)
            .garcomNome(mesa.getGarcom() != null ? mesa.getGarcom().getNome() : null)
            .build());
    }

    @Transactional
    public MesaDto create(MesaDto mesaDto, UUID quiosqueId) {        if (mesaRepository.existsByQuiosqueIdAndNumero(quiosqueId, mesaDto.getNumero())) {
            throw new IllegalArgumentException("A Mesa N° " + mesaDto.getNumero() + " já está cadastrada neste quiosque.");
        }
                Quiosque quiosque = quiosqueRepository.findById(quiosqueId)
            .orElseThrow(() -> new RuntimeException("Quiosque n�o encontrado"));

        Garcom garcom = null;
        if (mesaDto.getGarcomId() != null) {
            garcom = garcomRepository.findById(mesaDto.getGarcomId())
                .orElseThrow(() -> new RuntimeException("Gar�on n�o encontrado"));
        }

        Mesa mesa = Mesa.builder()
            .numero(mesaDto.getNumero())
            .status(mesaDto.getStatus() != null ? mesaDto.getStatus() : true)
            .garcom(garcom)
            .quiosque(quiosque)
            .build();

        mesa = mesaRepository.save(mesa);

        return MesaDto.builder()
            .id(mesa.getId())
            .numero(mesa.getNumero())
            .status(mesa.getStatus())
            .garcomId(mesa.getGarcom() != null ? mesa.getGarcom().getId() : null)
            .garcomNome(mesa.getGarcom() != null ? mesa.getGarcom().getNome() : null)
            .build();
    }

    @Transactional
    public java.util.List<MesaDto> createLote(com.webone.quiosq.dto.MesaLoteDto dto, UUID quiosqueId) {
        if (dto.getNumeroInicial() == null || dto.getNumeroFinal() == null || dto.getNumeroInicial() > dto.getNumeroFinal()) {
            throw new IllegalArgumentException("Intervalo de mesas invalido.");
        }
        Quiosque quiosque = quiosqueRepository.findById(quiosqueId)
            .orElseThrow(() -> new RuntimeException("Quiosque não encontrado"));

        Garcom garcom = null;
        if (dto.getGarcomId() != null) {
            garcom = garcomRepository.findById(dto.getGarcomId())
                .orElseThrow(() -> new RuntimeException("Garçom não encontrado"));
        }

        java.util.List<MesaDto> result = new java.util.ArrayList<>();
        for (int i = dto.getNumeroInicial(); i <= dto.getNumeroFinal(); i++) {
            boolean exists = mesaRepository.existsByQuiosqueIdAndNumero(quiosqueId, i);
            if (exists) {
                throw new IllegalArgumentException("A Mesa N° " + i + " já está cadastrada neste quiosque.");
            }
            Mesa mesa = Mesa.builder()
                .numero(i)
                .status(true)
                .garcom(garcom)
                .quiosque(quiosque)
                .build();
            mesa = mesaRepository.save(mesa);

            result.add(MesaDto.builder()
                .id(mesa.getId())
                .numero(mesa.getNumero())
                .status(mesa.getStatus())
                .garcomId(mesa.getGarcom() != null ? mesa.getGarcom().getId() : null)
                .garcomNome(mesa.getGarcom() != null ? mesa.getGarcom().getNome() : null)
                .build());
        }
        return result;
    }

    @Transactional
    public void delete(UUID id) {
        mesaRepository.deleteById(id);
    }
    
    @Transactional
    public void activate(UUID id) {
        Mesa mesa = mesaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mesa n�o encontrada"));
        mesa.setStatus(true);
        mesaRepository.save(mesa);
    }

    @Transactional
    public MesaDto update(MesaDto mesaDto) {
        Mesa mesa = mesaRepository.findById(mesaDto.getId())
            .orElseThrow(() -> new RuntimeException("Mesa n�o encontrada"));
        if (!mesa.getNumero().equals(mesaDto.getNumero())) {
            if (mesaRepository.existsByQuiosqueIdAndNumero(mesa.getQuiosque().getId(), mesaDto.getNumero())) {
                throw new IllegalArgumentException("A Mesa N° " + mesaDto.getNumero() + " já está cadastrada.");
            }
        }
        Garcom garcom = null;
        if (mesaDto.getGarcomId() != null) {
            garcom = garcomRepository.findById(mesaDto.getGarcomId())
                .orElse(null);
        }

        mesa.setNumero(mesaDto.getNumero());
        mesa.setStatus(mesaDto.getStatus() != null ? mesaDto.getStatus() : mesa.getStatus());
        mesa.setGarcom(garcom);

        mesa = mesaRepository.save(mesa);

        return MesaDto.builder()
            .id(mesa.getId())
            .numero(mesa.getNumero())
            .status(mesa.getStatus())
            .garcomId(mesa.getGarcom() != null ? mesa.getGarcom().getId() : null)
            .garcomNome(mesa.getGarcom() != null ? mesa.getGarcom().getNome() : null)
            .build();
    }

    @Transactional
    public void deleteAllByQuiosque(UUID quiosqueId) {
        mesaRepository.deleteByQuiosqueId(quiosqueId);
    }
    @Transactional
    public void deleteBatch(java.util.List<UUID> ids) {
        mesaRepository.deleteAllById(ids);
    }
}
