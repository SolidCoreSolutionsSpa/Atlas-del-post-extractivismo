import { describe, expect, it } from 'vitest'

import { EscenasService } from '../services/escenasService'
import { InMemoryEscenasRepository } from '../repo/escenasRepository'

describe('EscenasService', () => {
  const service = new EscenasService({
    escenasRepository: new InMemoryEscenasRepository(),
  })

  it('returns scenes by zone', async () => {
    const data = await service.getByZone('puerto-punta-chungo')
    expect(data).toHaveLength(1)
  })
})
