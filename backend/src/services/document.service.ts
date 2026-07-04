import PDFDocument from "pdfkit";

export type PromotionDecreeData = {
  skNumber: string;
  promotionId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  oldPositionName: string;
  oldPositionLevel: number;
  newPositionName: string;
  newPositionLevel: number;
  reason: string;
  evaluationScore: number | null;
  evaluationPeriod: string | null;
  requestedByName: string;
  approvedByName: string;
  approvedAt: Date;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Renders a formal "Surat Keputusan Kenaikan Pangkat" as a PDF buffer.
// The document deliberately does NOT embed its own hash — the hash is
// computed from these exact bytes afterwards, so embedding it here would
// change the very bytes being hashed. Verification instead works by
// promotionId: look up the anchored hash (DB + blockchain) and compare it
// against the hash of whatever PDF file is being checked.
export function generatePromotionDecree(data: PromotionDecreeData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("EMPLOYEE PERFORMANCE SYSTEM", { align: "center" })
      .fontSize(9)
      .font("Helvetica")
      .text("Sistem Penilaian Kinerja & Kenaikan Pangkat Karyawan", { align: "center" })
      .moveDown(0.3);
    doc.moveTo(56, doc.y).lineTo(539, doc.y).lineWidth(1.5).stroke();
    doc.moveDown(1);

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("SURAT KEPUTUSAN KENAIKAN PANGKAT", { align: "center" })
      .fontSize(10)
      .font("Helvetica")
      .text(`Nomor: ${data.skNumber}`, { align: "center" })
      .moveDown(1.2);

    doc.fontSize(10).font("Helvetica");
    const evalLine = data.evaluationScore !== null
      ? `hasil evaluasi kinerja periode ${data.evaluationPeriod ?? "-"} dengan skor akhir ${data.evaluationScore.toFixed(2)}/100`
      : "hasil evaluasi kinerja karyawan";
    doc.text(
      `Menimbang bahwa berdasarkan ${evalLine}, serta pertimbangan sebagai berikut:`,
      { align: "justify" }
    );
    doc.moveDown(0.5);
    doc.font("Helvetica-Oblique").text(`"${data.reason}"`, { align: "justify", indent: 20 });
    doc.font("Helvetica").moveDown(1);

    doc.font("Helvetica-Bold").text("MEMUTUSKAN:").font("Helvetica").moveDown(0.5);

    const rows: [string, string][] = [
      ["Nama Karyawan", data.employeeName],
      ["Kode Karyawan", data.employeeCode],
      ["Departemen", data.departmentName],
      ["Jabatan Lama", `${data.oldPositionName} (Level ${data.oldPositionLevel})`],
      ["Jabatan Baru", `${data.newPositionName} (Level ${data.newPositionLevel})`],
      ["Berlaku Efektif", DATE_FORMATTER.format(data.approvedAt)],
    ];
    const labelWidth = 150;
    for (const [label, value] of rows) {
      const y = doc.y;
      doc.font("Helvetica-Bold").text(label, 56, y, { width: labelWidth, continued: false });
      doc.font("Helvetica").text(`: ${value}`, 56 + labelWidth, y);
      doc.moveDown(0.3);
    }
    doc.moveDown(1);

    const colWidth = (539 - 56) / 2;
    const signY = doc.y + 20;
    doc.font("Helvetica").fontSize(10);
    doc.text("Diajukan oleh,", 56, signY, { width: colWidth, align: "center" });
    doc.text("Disetujui oleh,", 56 + colWidth, signY, { width: colWidth, align: "center" });
    doc.moveDown(3);
    const nameY = doc.y;
    doc.font("Helvetica-Bold");
    doc.text(data.requestedByName, 56, nameY, { width: colWidth, align: "center", underline: true });
    doc.text(data.approvedByName, 56 + colWidth, nameY, { width: colWidth, align: "center", underline: true });
    doc.font("Helvetica").fontSize(9);
    doc.text("Manajer Pengaju", 56, nameY + 14, { width: colWidth, align: "center" });
    doc.text("Direktur", 56 + colWidth, nameY + 14, { width: colWidth, align: "center" });

    doc.moveDown(3);
    doc.moveTo(56, doc.y).lineTo(539, doc.y).lineWidth(0.5).dash(2, { space: 2 }).stroke().undash();
    doc.moveDown(0.5);
    doc
      .fontSize(8)
      .font("Helvetica-Oblique")
      .fillColor("#555555")
      .text(
        `Dokumen ini diterbitkan secara digital dan integritasnya diamankan lewat blockchain (Sepolia testnet). ` +
        `Kode Verifikasi (Promotion ID): ${data.promotionId}. Untuk memverifikasi keaslian dokumen ini, unggah ` +
        `file PDF asli melalui fitur "Verifikasi Dokumen" pada aplikasi — hash file akan dibandingkan dengan ` +
        `catatan di database dan di blockchain.`,
        { align: "justify" }
      )
      .fillColor("#000000");

    doc.end();
  });
}
