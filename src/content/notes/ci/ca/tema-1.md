---
title: "Tema 1: Pins de GPIO (TRIS, LAT, PORT i Tri-State)"
description: "Simulació interactiva del circuit intern d'un pin GPIO al microcontrolador PIC18F"
readTime: "5 min"
order: 1
draft: false
---

::circuitviz{simulation="pin_gpio"}

# 1. Circuit intern d'un pin GPIO (PIC18F)

En un microcontrolador, cada pin d'entrada/sortida digital (GPIO) està controlat internament per biestables de dades (`LAT`), biestables de direcció (`TRIS`) i un **buffer tri-state** que permet alternar entre sortir tensió (0V o 5V) o deixar el pin en **Alta Impedància ($Z$)** per actuar com a entrada.

![Diagrama de blocs del microcontrolador PIC18F](/ci/svgs/pic18f-block-diagram.svg)
