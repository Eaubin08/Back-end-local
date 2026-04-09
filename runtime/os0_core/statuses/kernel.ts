export enum KernelState {
  IDLE = 'idle',
  RECEIVING = 'receiving',
  CHECKING = 'checking',
  ALLOWING = 'allowing',
  HOLDING = 'holding',
  BLOCKING = 'blocking',
  REJECTING = 'rejecting',
  TRACED = 'traced',
  FAULT = 'fault',
  AUDIT_ESCALATED = 'audit_escalated'
}
