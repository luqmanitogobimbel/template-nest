export function setKunciJawaban(tipeSoal: string, opsi: object) {
  switch (tipeSoal) {
    case 'PGB':
      let kunciJawabanPGB: string;
      for (const key in opsi['opsi']) {
        if (opsi['opsi'][key][`bobot`] === 100) {
          kunciJawabanPGB = key;
        }
      }

      return kunciJawabanPGB;

    case 'PBT':
      let kunciJawabanPBT = [];
      for (const [key, value] of Object.entries(opsi[`opsi`])) {
        const jawaban = value[`jawaban`];
        const urut = jawaban.filter((obj) => Object.values(obj).includes(true));
        const jawabanValue =
          urut.length > 0 ? parseInt(urut[0][`urut`].toString()) - 1 : -1;
        kunciJawabanPBT.push(jawabanValue);
      }

      return kunciJawabanPBT;

    case 'PBK':
    case 'PBCT':
      const dataKunci = opsi[`kunci`];
      const kunciJawabanKompleks = dataKunci.map((item: any) =>
        item.toString(),
      );

      return kunciJawabanKompleks;

    case 'PBB':
      const kunciJawabanAlasan = {};
      for (const [key, value] of Object.entries(opsi[`opsi`])) {
        const indexOpsi: any = value[`isbenar`] === true ? key : null;
        const listAlasan: any =
          value[`isbenar`] === true ? value[`alasan`] : null;

        if (indexOpsi !== null && listAlasan !== null) {
          for (const [key, value] of Object.entries(listAlasan)) {
            const isAlasanTrue = value[`isbenar`] === true ? 1 : 0;
            listAlasan.push(isAlasanTrue);
          }

          kunciJawabanAlasan[`opsi`] = indexOpsi;
          kunciJawabanAlasan[`alasan`] = listAlasan;
        }
      }
      return kunciJawabanAlasan;

    case 'PBM':
      const kunciJawabanPasangan = [];
      for (const [key, value] of Object.entries(opsi[`opsi`])) {
        kunciJawabanPasangan.push(value[`jodoh`] ?? -1);
      }
      return kunciJawabanPasangan;

    case 'ESSAY':
    case 'ESSAY NUMERIK':
      return opsi[`keyword`];

    case 'ESSAY MAJEMUK':
      const kunciJawabanMajemuk = [];
      for (const [key, value] of Object.entries(opsi[`soal`])) {
        kunciJawabanMajemuk.push(value[`keywords`] ?? -1);
      }

      return kunciJawabanMajemuk;

    // Digunakan untuk tipe soal PBS
    default:
      return opsi[`kunci`];
  }
}

export function setTranslatorEPB(tipeSoal: string, opsi: object) {
  switch (tipeSoal) {
    case 'PBT':
      const identifier = 'kolom' in opsi ? opsi[`kolom`] : null;
      const kolom: any = identifier !== null ? identifier : [];
      if (kolom.length === 0) return kolom;

      // Menghilangkan kolom pernyataan
      kolom.shift();

      const result = kolom.map((item) => {
        let start = `${item[`judul`]}`.indexOf(`(`);
        let end = `${item[`judul`]}`.indexOf(`)`);
        end = end < 0 ? start + 2 : end;

        return start < 0
          ? `${item[`judul`]}`.trim().substring(0, 1)
          : `${item[`judul`]}`.trim().substring(start + 1, end);
      });
      return result;
  }
}

export function setTranslateJawabanEPB(
  tipeSoal: string,
  jawaban: any,
  translator: any,
) {
  switch (tipeSoal) {
    case 'PBT':
      const jawabanEPB = [];
      if (jawaban === null) return null;

      for (const item of jawaban) {
        const formattedJawaban: string = item < 0 ? '' : translator[item];
        jawabanEPB.push(formattedJawaban);
      }

      return jawabanEPB;
  }
}

export function formatEssay(essay) {
  const regex = /(?:_|[^\w\s])+/g;

  return essay.toLowerCase().replace(regex, '').replace(/  /g, ' ');
}

export function setNilai(
  tipeSoal: string,
  jawabanSiswa: any,
  kunciJawaban: any,
  opsi: object,
): number {
  let fullCredit = opsi[`nilai`][`fullcredit`];
  let halfCredit = opsi[`nilai`][`halfcredit`];
  let zeroCredit = opsi[`nilai`][`zerocredit`];
  let nilai = 0;

  switch (tipeSoal) {
    case 'PBT':
      if (!Array.isArray(jawabanSiswa)) {
        return 0;
      }
      const listJawabanPBT: Array<number> = jawabanSiswa ?? [];
      const hasilPenilaianPBT: Array<boolean> = [];

      if (listJawabanPBT.length > 0) {
        listJawabanPBT.forEach((jawaban, index) => {
          const nilai: boolean =
            jawaban !== -1 ? jawaban === kunciJawaban[index] : null;
          if (nilai ?? false) {
            hasilPenilaianPBT.push(nilai ?? false);
          }
        });

        const hasilBenarPBT: Array<boolean> = hasilPenilaianPBT.filter(
          (nilai) => nilai === true,
        );

        if (hasilBenarPBT.length >= fullCredit) {
          nilai = 1;
        } else if (
          hasilBenarPBT.length >= halfCredit &&
          hasilBenarPBT.length < fullCredit
        ) {
          nilai = 0.5;
        } else if (
          hasilBenarPBT.length >= zeroCredit &&
          hasilBenarPBT.length < halfCredit
        ) {
          nilai = 0;
        }
      }

      return nilai;

    case 'PBCT':
      const listJawabanPBCT: Array<number> = jawabanSiswa ?? [];
      const hasilPenilaianPBCT: Array<any> = [];

      if (listJawabanPBCT.length === 0) {
        return 0;
      } else {
        listJawabanPBCT.forEach((jawaban) => {
          if (kunciJawaban.includes(jawaban)) {
            hasilPenilaianPBCT.push(jawaban);
          }
        });
      }

      if (hasilPenilaianPBCT.length >= fullCredit) {
        nilai = 1;
      } else if (
        hasilPenilaianPBCT.length >= halfCredit &&
        hasilPenilaianPBCT.length < fullCredit
      ) {
        nilai = 0.5;
      } else if (
        hasilPenilaianPBCT.length >= zeroCredit &&
        hasilPenilaianPBCT.length < halfCredit
      ) {
        nilai = 0;
      }

      return nilai;

    case 'PBK':
      const listJawabanPBK: Array<number> = jawabanSiswa ?? [];
      const hasilPenilaianPBK: Array<any> = [];
      fullCredit = kunciJawaban.length;
      halfCredit = Math.floor(fullCredit / 2);
      zeroCredit = 0;

      if (listJawabanPBK.length === 0) {
        return 0;
      } else {
        listJawabanPBK.forEach((jawaban) => {
          if (kunciJawaban.includes(jawaban)) {
            hasilPenilaianPBK.push(jawaban);
          }
        });
      }

      if (hasilPenilaianPBK.length >= fullCredit) {
        nilai = 1;
      } else if (
        hasilPenilaianPBK.length >= halfCredit &&
        hasilPenilaianPBK.length < fullCredit
      ) {
        nilai = 0.5;
      } else if (
        hasilPenilaianPBK.length >= zeroCredit &&
        hasilPenilaianPBK.length < halfCredit
      ) {
        nilai = 0;
      }

      return nilai;

    // PBB mungkin masih perlu diperbaiki karena soalnya sudah tidak dipakai
    case 'PBB':
      const tempJawabanSiswaPBB = jawabanSiswa;
      const hasilPenilaianPBB: Array<boolean> = [];

      if (tempJawabanSiswaPBB.length === 0) {
        return 0;
      } else {
        const opsiPilihanSiswa = tempJawabanSiswaPBB[`opsi`];
        const kunciJawabanOpsi = kunciJawaban[`opsi`];

        if (kunciJawabanOpsi === opsiPilihanSiswa) {
          const jawabanAlasanSiswa = tempJawabanSiswaPBB[`alasan`];
          const kunciJawabanAlasan = kunciJawaban[`alasan`];

          jawabanAlasanSiswa.forEach((jawabanAlasan, index) => {
            const nilaiSiswa =
              jawabanAlasan !== -1
                ? jawabanAlasan === 0
                  ? false
                  : jawabanAlasan === kunciJawabanAlasan[index]
                : null;

            if (nilaiSiswa !== null) hasilPenilaianPBB.push(nilaiSiswa);
          });

          if (!hasilPenilaianPBB.includes(false)) {
            if (hasilPenilaianPBB.length >= fullCredit) {
              nilai = 1;
            } else if (
              hasilPenilaianPBB.length >= halfCredit &&
              hasilPenilaianPBB.length < fullCredit
            ) {
              nilai = 0.5;
            } else if (
              hasilPenilaianPBB.length >= zeroCredit &&
              hasilPenilaianPBB.length < halfCredit
            ) {
              nilai = 0;
            }
          }
        }
      }

      return nilai;

    case 'PBM':
      const listJawabanPBM: Array<number> = jawabanSiswa ?? [];
      const hasilPenilaianPBM: Array<boolean> = [];

      if (listJawabanPBM.length === 0) {
        return 0;
      } else {
        listJawabanPBM.forEach((jawabanSiswa, index) => {
          const nilaiSiswa =
            jawabanSiswa !== -1 ? jawabanSiswa === kunciJawaban[index] : null;

          if (nilaiSiswa !== null) hasilPenilaianPBM.push(nilaiSiswa);
        });

        const hasilBenarPBM: Array<boolean> = hasilPenilaianPBM.filter(
          (nilai) => nilai === true,
        );

        if (hasilBenarPBM.length >= fullCredit) {
          nilai = 1;
        } else if (
          hasilBenarPBM.length >= halfCredit &&
          hasilBenarPBM.length < fullCredit
        ) {
          nilai = 0.5;
        } else if (
          hasilBenarPBM.length >= zeroCredit &&
          hasilBenarPBM.length < halfCredit
        ) {
          nilai = 0;
        }
      }

      return nilai;

    case 'ESSAY':
    case 'ESSAY NUMERIK':
      let formattedJawaban = formatEssay(jawabanSiswa);

      let totalKeyword = 0;

      kunciJawaban.forEach((kunci, index) => {
        const keywords = kunci;

        keywords.forEach((key, index) => {
          const keyword: string = key.toString().toLowerCase();
          let keywordPosition = formattedJawaban.indexOf(keyword);

          if (keywordPosition >= 0) {
            formattedJawaban = formattedJawaban.replace(keyword, '');
            totalKeyword++;
          }
        });
      });

      if (totalKeyword >= fullCredit) {
        nilai = 1;
      } else if (totalKeyword >= halfCredit && totalKeyword < fullCredit) {
        nilai = 0.5;
      } else if (totalKeyword >= zeroCredit && totalKeyword < halfCredit) {
        nilai = 0;
      }

      return nilai;

    case 'ESSAY MAJEMUK':
      let totalCorrectKeyword = 0;
      const listJawabanEssayMajemuk: Array<string> = jawabanSiswa ?? [];

      listJawabanEssayMajemuk.forEach((jawaban, index) => {
        let formattedResult: string = formatEssay(jawaban);
        const fc = opsi[`soal`][index][`fullcredit`];
        const hc = opsi[`soal`][index][`halfcredit`];
        const zc = opsi[`soal`][index][`zerocredit`];

        let totalKeyword = 0;
        const kunciJawabanKeywords = kunciJawaban[index];
        kunciJawabanKeywords.forEach((kunci, index) => {
          let keywords = kunci;

          keywords.forEach((key, i) => {
            let keyword: string = key.toString().toLowerCase();
            let keywordPosition = formattedResult.indexOf(keyword);

            if (keywordPosition >= 0) {
              formattedResult = formattedResult.replace(keyword, '');
              totalKeyword++;
            }
          });
        });

        if (totalKeyword >= fc) {
          totalCorrectKeyword += 1;
        } else if (hc !== 0 && totalKeyword >= hc && totalKeyword < fc) {
          totalCorrectKeyword += 0.5;
        } else if (zc !== 0 && totalKeyword >= zc && totalKeyword < hc) {
          return 0;
        }
      });

      if (totalCorrectKeyword >= fullCredit) {
        nilai = 1;
      } else if (
        totalCorrectKeyword >= halfCredit &&
        totalCorrectKeyword < fullCredit
      ) {
        nilai = 0.5;
      } else if (
        totalCorrectKeyword >= zeroCredit &&
        totalCorrectKeyword < halfCredit
      ) {
        nilai = 0;
      }

      return nilai;

    case 'PBS':
    case 'PGB':
    default:
      if (jawabanSiswa === kunciJawaban) {
        nilai = 1;
      } else {
        nilai = 0;
      }
  }
  return nilai;
}
