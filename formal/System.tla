--------------------------- MODULE System ---------------------------
EXTENDS Naturals, Sequences, FiniteSets

VARIABLES 
    kernel_state,    \* {IDLE, PROCESSING, ERROR}
    audit_log,       \* Sequence of DecisionTickets
    merkle_root      \* Hash of the current state

DecisionTicket == [
    id: Nat,
    verdict: {"BLOCK", "HOLD", "ALLOW"},
    risk: Nat,
    uncertainty: Nat,
    timestamp: Nat
]

Init == 
    /\ kernel_state = "IDLE"
    /\ audit_log = << >>
    /\ merkle_root = 0

Next ==
    \/ /\ kernel_state = "IDLE"
       /\ \E r, u \in 0..100 :
            LET verdict == IF r > 80 THEN "BLOCK" 
                           ELSE IF u > 50 THEN "HOLD"
                           ELSE "ALLOW"
            IN
            /\ audit_log' = Append(audit_log, [id |-> Len(audit_log) + 1, 
                                              verdict |-> verdict, 
                                              risk |-> r, 
                                              uncertainty |-> u, 
                                              timestamp |-> 0])
            /\ kernel_state' = "IDLE"
            /\ merkle_root' = merkle_root + 1 \* Simplified hash update

Spec == Init /\ [][Next]_<<kernel_state, audit_log, merkle_root>>

=============================================================================
