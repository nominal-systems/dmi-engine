import configuration from './configuration'

describe('configuration', () => {
  const originalOverrides = process.env.STATSIG_OVERRIDES

  afterEach(() => {
    if (originalOverrides === undefined) {
      delete process.env.STATSIG_OVERRIDES
    } else {
      process.env.STATSIG_OVERRIDES = originalOverrides
    }
  })

  it('parses Statsig overrides from the environment', () => {
    process.env.STATSIG_OVERRIDES = 'flag_a=true, flag_b=false,flag_c=true'

    const config = configuration()

    expect(config.statsig.overrides).toEqual({
      flag_a: true,
      flag_b: false,
      flag_c: true
    })
  })
})
