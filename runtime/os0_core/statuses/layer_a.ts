export enum LayerAState {
  IDLE = 'idle',
  RECEIVING = 'receiving',
  SCREENING = 'screening',
  SUBMIT_TO_KERNEL = 'submit_to_kernel',
  HOLDING = 'holding',
  BLOCKING = 'blocking',
  RETURNING = 'returning',
  TRACED = 'traced',
  FAULT = 'fault',
  AUDIT_ESCALATED = 'audit_escalated'
}
