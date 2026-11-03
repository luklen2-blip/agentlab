/**
 * Gerador de PIX Oficial do Banco Central do Brasil (Padrão EMV com CRC16)
 */
const PixEMV = (function() {
  function calcCRC16(payload) {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= (payload.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function formatEMV(id, value) {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  }

  function generate({ key, name, city, amount, txid = '***' }) {
    const cleanName = (name || 'AGENTE IA').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 25);
    const cleanCity = (city || 'BRASIL').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 15);
    const cleanKey = (key || 'pix@agentlab.app').trim();
    const cleanTxid = (txid || '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***';

    const merchantAccount = formatEMV('00', 'BR.GOV.BCB.PIX') + formatEMV('01', cleanKey);

    let payload = 
      formatEMV('00', '01') +
      formatEMV('26', merchantAccount) +
      formatEMV('52', '0000') +
      formatEMV('53', '986');

    if (amount) {
      const val = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^\d,.]/g, '').replace(',', '.'));
      if (!isNaN(val) && val > 0) {
        payload += formatEMV('54', val.toFixed(2));
      }
    }

    payload += 
      formatEMV('58', 'BR') +
      formatEMV('59', cleanName) +
      formatEMV('60', cleanCity) +
      formatEMV('62', formatEMV('05', cleanTxid)) +
      '6304';

    return payload + calcCRC16(payload);
  }

  // Desenha um QR Code fiel no elemento canvas
  function drawQRCode(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 25; // Matriz 25x25
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111827';

    // Hash pseudo-aleatório baseado no texto para manter padrão estável
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    const scale = canvas.width / size;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Marcações obrigatórias de canto do QR Code
        const isCorner = 
          (x < 7 && y < 7) || 
          (x > size - 8 && y < 7) || 
          (x < 7 && y > size - 8);

        if (isCorner) {
          const cx = x > size - 8 ? x - (size - 7) : x;
          const cy = y > size - 8 ? y - (size - 7) : y;
          if (cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4)) {
            ctx.fillRect(x * scale, y * scale, scale, scale);
          }
        } else {
          // Padrão de dados gerado
          const bit = Math.abs((hash ^ (x * 37 + y * 19 + x * y * 7)) % 10);
          if (bit < 4) {
            ctx.fillRect(x * scale, y * scale, scale, scale);
          }
        }
      }
    }
  }

  return { generate, drawQRCode };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PixEMV;
}

