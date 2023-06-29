export type SafetyCheckManager = {
  version: '0.1.0';
  name: 'safety_check_manager';
  instructions: [
    {
      name: 'createSite';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'site';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'siteId';
          type: 'string';
        }
      ];
    },
    {
      name: 'createInspector';
      accounts: [
        {
          name: 'site';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'inspector';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'siteId';
          type: 'string';
        }
      ];
    },
    {
      name: 'createDevice';
      accounts: [
        {
          name: 'site';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'device';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'siteId';
          type: 'string';
        },
        {
          name: 'deviceId';
          type: 'string';
        }
      ];
    },
    {
      name: 'createSafetyCheck';
      accounts: [
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'metadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'site';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'device';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'inspector';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'safetyCheck';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'safetyCheckMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'deviceSafetyCheckVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'safetyCheckMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'safetyCheckMasterEdition';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'siteId';
          type: 'string';
        },
        {
          name: 'deviceId';
          type: 'string';
        },
        {
          name: 'safetyCheckId';
          type: 'string';
        },
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
        {
          name: 'uri';
          type: 'string';
        },
        {
          name: 'durationInDays';
          type: 'i64';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'site';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'inspector';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'device';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'expiresAt';
            type: {
              option: 'i64';
            };
          },
          {
            name: 'lastSafetyCheck';
            type: {
              option: 'publicKey';
            };
          },
          {
            name: 'bump';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'safetyCheck';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'inspector';
            type: 'publicKey';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
          {
            name: 'durationInDays';
            type: 'i64';
          },
          {
            name: 'expiresAt';
            type: 'i64';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'mintBump';
            type: 'u8';
          },
          {
            name: 'metadataBump';
            type: 'u8';
          },
          {
            name: 'masterEditionBump';
            type: 'u8';
          }
        ];
      };
    }
  ];
};

export const IDL: SafetyCheckManager = {
  version: '0.1.0',
  name: 'safety_check_manager',
  instructions: [
    {
      name: 'createSite',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'site',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'siteId',
          type: 'string',
        },
      ],
    },
    {
      name: 'createInspector',
      accounts: [
        {
          name: 'site',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'inspector',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'siteId',
          type: 'string',
        },
      ],
    },
    {
      name: 'createDevice',
      accounts: [
        {
          name: 'site',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'device',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'siteId',
          type: 'string',
        },
        {
          name: 'deviceId',
          type: 'string',
        },
      ],
    },
    {
      name: 'createSafetyCheck',
      accounts: [
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'site',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'device',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'inspector',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'safetyCheck',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'safetyCheckMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'deviceSafetyCheckVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'safetyCheckMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'safetyCheckMasterEdition',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'siteId',
          type: 'string',
        },
        {
          name: 'deviceId',
          type: 'string',
        },
        {
          name: 'safetyCheckId',
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'symbol',
          type: 'string',
        },
        {
          name: 'uri',
          type: 'string',
        },
        {
          name: 'durationInDays',
          type: 'i64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'site',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'inspector',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'device',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'expiresAt',
            type: {
              option: 'i64',
            },
          },
          {
            name: 'lastSafetyCheck',
            type: {
              option: 'publicKey',
            },
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'safetyCheck',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'inspector',
            type: 'publicKey',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
          {
            name: 'durationInDays',
            type: 'i64',
          },
          {
            name: 'expiresAt',
            type: 'i64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'mintBump',
            type: 'u8',
          },
          {
            name: 'metadataBump',
            type: 'u8',
          },
          {
            name: 'masterEditionBump',
            type: 'u8',
          },
        ],
      },
    },
  ],
};
