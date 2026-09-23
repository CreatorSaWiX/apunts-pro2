import { StreamLanguage } from '@codemirror/language';

// PIC18(L)F2X/4XK22 Instruction Set (TABLE 25-2 - Esquemes, taules i joc d'instruccions pels exàmens de CI)
const MNEMONICS = new Set([
    // Byte-Oriented Operations
    'ADDWF', 'ADDWFC', 'ANDWF', 'CLRF', 'COMF', 'CPFSEQ', 'CPFSGT', 'CPFSLT',
    'DECF', 'DECFSZ', 'DCFSNZ', 'INCF', 'INCFSZ', 'INFNSZ', 'IORWF',
    'MOVF', 'MOVFF', 'MOVWF', 'MULWF', 'NEGF', 'RLCF', 'RLNCF', 'RRCF', 'RRNCF',
    'SETF', 'SUBFWB', 'SUBWF', 'SUBWFB', 'SWAPF', 'TSTFSZ', 'XORWF',

    // Literal Operations
    'ADDLW', 'ANDLW', 'IORLW', 'LFSR', 'MOVLB', 'MOVLW', 'MULLW',
    'RETLW', 'SUBLW', 'XORLW',

    // Bit-Oriented Operations
    'BCF', 'BSF', 'BTFSC', 'BTFSS', 'BTG',

    // Control Operations
    'BC', 'BN', 'BNC', 'BNN', 'BNOV', 'BNZ', 'BOV', 'BRA', 'BZ',
    'CALL', 'CLRWDT', 'DAW', 'GOTO', 'NOP', 'POP', 'PUSH',
    'RCALL', 'RESET', 'RETFIE', 'RETURN', 'SLEEP',

    // Data Memory <-> Program Memory (Table) Operations
    'TBLRD', 'TBLRD*', 'TBLRD*+', 'TBLRD*-', 'TBLRD+*',
    'TBLWT', 'TBLWT*', 'TBLWT*+', 'TBLWT*-', 'TBLWT+*'
]);

// Special Function Registers (SFR) and common symbols in CI (PIC18F2X/4XK22)
const REGISTERS = new Set([
    // Core CPU & Control
    'W', 'WREG', 'STATUS', 'BSR', 'RCON', 'OSCCON', 'OSCTUNE', 'WDTCON',
    'PC', 'PCL', 'PCH', 'PCLATH', 'PCLATU',
    'STKPTR', 'TOS', 'TOSL', 'TOSH', 'TOSU',
    'PROD', 'PRODH', 'PRODL',
    'TABLAT', 'TBLPTR', 'TBLPTRL', 'TBLPTRH', 'TBLPTRU',

    // Interrupts
    'INTCON', 'INTCON2', 'INTCON3',
    'PIR1', 'PIR2', 'PIR3', 'PIR4', 'PIR5',
    'PIE1', 'PIE2', 'PIE3', 'PIE4', 'PIE5',
    'IPR1', 'IPR2', 'IPR3', 'IPR4', 'IPR5',

    // GPIO & Tristate
    'TRISA', 'TRISB', 'TRISC', 'TRISD', 'TRISE',
    'LATA', 'LATB', 'LATC', 'LATD', 'LATE',
    'PORTA', 'PORTB', 'PORTC', 'PORTD', 'PORTE',
    'ANSELA', 'ANSELB', 'ANSELC', 'ANSELD', 'ANSELE',

    // Indirect Addressing & Pointers
    'FSR0', 'FSR0L', 'FSR0H', 'INDF0', 'POSTINC0', 'POSTDEC0', 'PREINC0', 'PLUSW0',
    'FSR1', 'FSR1L', 'FSR1H', 'INDF1', 'POSTINC1', 'POSTDEC1', 'PREINC1', 'PLUSW1',
    'FSR2', 'FSR2L', 'FSR2H', 'INDF2', 'POSTINC2', 'POSTDEC2', 'PREINC2', 'PLUSW2',

    // Timers
    'T0CON', 'TMR0', 'TMR0L', 'TMR0H',
    'T1CON', 'T1GCON', 'TMR1', 'TMR1L', 'TMR1H',
    'T2CON', 'PR2', 'TMR2',
    'T3CON', 'T3GCON', 'TMR3', 'TMR3L', 'TMR3H',
    'T4CON', 'PR4', 'TMR4',
    'T5CON', 'T5GCON', 'TMR5', 'TMR5L', 'TMR5H',
    'T6CON', 'PR6', 'TMR6',

    // ADC & References
    'ADCON0', 'ADCON1', 'ADCON2', 'ADRES', 'ADRESH', 'ADRESL',
    'VREFCON0', 'VREFCON1', 'VREFCON2',

    // CCP & PWM
    'CCP1CON', 'CCPR1L', 'CCPR1H', 'CCP2CON', 'CCPR2L', 'CCPR2H',
    'CCP3CON', 'CCPR3L', 'CCPR3H', 'CCP4CON', 'CCPR4L', 'CCPR4H',
    'CCP5CON', 'CCPR5L', 'CCPR5H', 'CCPTMRS0', 'CCPTMRS1',

    // Serial Communication (EUSART)
    'TXSTA', 'TXSTA1', 'TXSTA2', 'RCSTA', 'RCSTA1', 'RCSTA2',
    'BAUDCON', 'BAUDCON1', 'BAUDCON2',
    'SPBRG', 'SPBRGH', 'SPBRG1', 'SPBRGH1', 'SPBRG2', 'SPBRGH2',
    'RCREG', 'RCREG1', 'RCREG2', 'TXREG', 'TXREG1', 'TXREG2'
]);

export const pic18Asm = StreamLanguage.define({
    token(stream) {
        if (stream.eatSpace()) return null;

        // Comments starting with ;
        if (stream.match(/;.*/)) {
            return 'comment';
        }

        // Table read/write operations with operators (TBLRD*, TBLRD*+, TBLRD*-, TBLRD+*, etc.)
        if (stream.match(/^TBL(RD|WT)(\*[\+\-]?|\+\*)?/i)) {
            return 'keyword';
        }

        // Numbers: hex (0xFF, H'FF', FFh), binary (b'0101', B'0101'), decimal (d'255', 255)
        if (
            stream.match(/^0x[0-9a-fA-F]+/i) ||
            stream.match(/^[hH]'[0-9a-fA-F]+'/) ||
            stream.match(/^[0-9][0-9a-fA-F]*[hH]\b/i) ||
            stream.match(/^[bB]'[01]+'/) ||
            stream.match(/^[dD]'[0-9]+'/) ||
            stream.match(/^[0-9]+/)
        ) {
            return 'number';
        }

        // Strings
        if (stream.match(/^"[^"]*"/)) {
            return 'string';
        }

        // Words (mnemonics, registers, labels)
        if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
            const word = stream.current().toUpperCase();
            if (stream.peek() === ':') {
                stream.next();
                return 'labelName';
            }
            if (MNEMONICS.has(word)) {
                return 'keyword';
            }
            if (REGISTERS.has(word)) {
                return 'variableName';
            }
            return 'variable';
        }

        // Punctuation / Operators
        stream.next();
        return null;
    }
});
