package com.webone.quiosq;

import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Autowired;
import com.webone.quiosq.repository.MesaRepository;

@Component
public class DumpMesas implements CommandLineRunner {
    @Autowired
    MesaRepository repo;

    @Override
    public void run(String... args) {
        System.out.println("====== MESAS =====");
        repo.findAll().forEach(m -> System.out.println("Mesa " + m.getNumero() + ", Quiosque " + m.getQuiosque().getId() + ", Garcom " + (m.getGarcom() != null ? m.getGarcom().getNome() : "null")));
        System.out.println("==================");
    }
}
