import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {BluetoothEscposPrinter} from 'tp-react-native-bluetooth-printer';
import {hsdLogo} from './dummy-logo';

const printMenu = async url => {
  try {
    await BluetoothEscposPrinter.printColumn(
      [32],
      [BluetoothEscposPrinter.ALIGN.CENTER],
      ['onlen.id'],
      {},
    );
    await BluetoothEscposPrinter.printQRCode(
      'onlen.id',
      340,
      BluetoothEscposPrinter.ERROR_CORRECTION.H,
      0,
    );
    await BluetoothEscposPrinter.printColumn(
      [32],
      [BluetoothEscposPrinter.ALIGN.CENTER],
      ['Scan menu di sini'],
      {},
    );
    await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
  } catch (e) {
    alert(
      'Pastikan printer sudah terhubung atau dalam keadaan aktif, coba putuskan lalu hubungkan',
    );
  }
};

const SamplePrint = () => {
  return (
    <View>
      {/* <Text>Sample Print Instruction</Text> */}
      {/* <View style={styles.btn}>
        <Button
          onPress={async () => {
            await BluetoothEscposPrinter.printBarCode(
              '123456789012',
              BluetoothEscposPrinter.BARCODETYPE.JAN13,
              3,
              120,
              0,
              2,
            );
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          }}
          title="Print BarCode"
        />
      </View> */}
      <Button
        color={'#ff3e6c'}
        onPress={async () => {
          printMenu();
        }}
        title="Tes Print"
      />

      {/* <View style={styles.btn}>
        <Button
          onPress={async () => {
            await BluetoothEscposPrinter.printerUnderLine(2);
            await BluetoothEscposPrinter.printText('Prawito Hudoro\r\n', {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1,
            });
            await BluetoothEscposPrinter.printerUnderLine(0);
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          }}
          title="Print UnderLine"
        />
      </View> */}

      {/* <View style={styles.btn}>
        <Button
          title="Print Struk Belanja"
          onPress={async () => {
            let columnWidths = [8, 20, 20];
            try {
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
              await BluetoothEscposPrinter.printPic(hsdLogo, {
                width: 250,
                left: 150,
              });
              await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
              );
              await BluetoothEscposPrinter.printColumn(
                [48],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Jl. Brigjen Saptadji Hadiprawira No.93'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['https://xfood.id'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Customer', 'Prawito Hudoro'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Packaging', 'Iya'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Delivery', 'Ambil Sendiri'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printText('Products\r\n', {
                widthtimes: 1,
              });
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x', 'Cumi-Cumi', 'Rp.200.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x', 'Tongkol Kering', 'Rp.300.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x', 'Ikan Tuna', 'Rp.400.000'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Subtotal', 'Rp.900.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Packaging', 'Rp.6.000'],
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Delivery', 'Rp.0'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['Total', 'Rp.906.000'],
                {},
              );
              await BluetoothEscposPrinter.printText('\r\n\r\n', {});
              await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
              );
              await BluetoothEscposPrinter.printQRCode(
                'DP0837849839',
                280,
                BluetoothEscposPrinter.ERROR_CORRECTION.L,
                40,
              );
              await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
              );
              await BluetoothEscposPrinter.printColumn(
                [48],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['DP0837849839'],
                {widthtimes: 2},
              );
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printColumn(
                [48],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Sabtu, 18 Juni 2022 - 06:00 WIB'],
                {},
              );
              await BluetoothEscposPrinter.printText(
                '================================================',
                {},
              );
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            } catch (e) {
              alert(e.message || 'ERROR');
            }
          }}
        />
      </View> */}
    </View>
  );
};

// const printBillItem = async (productName, quantity, price, totalPrice) => {
//   let columnWidths = [13, 6, 13];
//   try {
//     BluetoothEscposPrinter.printColumn(
//       columnWidths,
//       [
//         BluetoothEscposPrinter.ALIGN.LEFT,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.RIGHT,
//       ],
//       [
//         productName.toString(),
//         quantity.toString(),
//         `@ ${convertToRupiah(price)}`,
//       ],
//       {},
//     );
//     BluetoothEscposPrinter.printColumn(
//       [6, 6, 6, 14],
//       [
//         BluetoothEscposPrinter.ALIGN.LEFT,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.RIGHT,
//       ],
//       ['', '', '', convertToRupiah(totalPrice)],
//       {},
//     );
//   } catch (error) {
//     alert(error.message || 'ERROR');
//   }
// };
// const printBill = async () => {
//   try {
//     await BluetoothEscposPrinter.printerAlign(
//       BluetoothEscposPrinter.ALIGN.CENTER,
//     );

//     await BluetoothEscposPrinter.printerAlign(
//       BluetoothEscposPrinter.ALIGN.LEFT,
//     );
//     await BluetoothEscposPrinter.printText(
//       'Nama：Asepshow,reza,jurahi,hehe,gg,wadaw,nina,noni,gugus\n\r',
//       {},
//     );
//     await BluetoothEscposPrinter.printText(
//       'Jam Order：8 Maret, 2:49 Siang\n\r',
//       {},
//     );
//     await BluetoothEscposPrinter.printText(
//       '--------------------------------\n\r',
//       {},
//     );
//     let columnWidths = [13, 7, 12];
//     await BluetoothEscposPrinter.printColumn(
//       columnWidths,
//       [
//         BluetoothEscposPrinter.ALIGN.LEFT,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.RIGHT,
//       ],
//       ['Pesanan', 'Jumlah', 'Harga'],
//       {},
//     );

//     await BluetoothEscposPrinter.printText('\n\r', {});
//     dataOrderDetail.items.map(item =>
//       printBillItem(
//         item.productName,
//         item.quantity,
//         item.price,
//         item.totalPrice,
//       ),
//     );
//     await BluetoothEscposPrinter.printText('\n\r', {});
//     await BluetoothEscposPrinter.printText(
//       '--------------------------------\n\r',
//       {},
//     );
//     BluetoothEscposPrinter.printColumn(
//       [10, 4, 4, 14],
//       [
//         BluetoothEscposPrinter.ALIGN.LEFT,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.RIGHT,
//       ],
//       ['Service', '', '', convertToRupiah(dataOrderDetail.serviceFee)],
//       {},
//     );
//     BluetoothEscposPrinter.printColumn(
//       [10, 4, 4, 14],
//       [
//         BluetoothEscposPrinter.ALIGN.LEFT,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.RIGHT,
//       ],
//       ['Pajak', '', '', convertToRupiah(dataOrderDetail.taxAmount)],
//       {},
//     );

//     await BluetoothEscposPrinter.printText(
//       '--------------------------------\n\r',
//       {},
//     );
//     await BluetoothEscposPrinter.printColumn(
//       [13, 7, 12],
//       [
//         BluetoothEscposPrinter.ALIGN.LEFT,
//         BluetoothEscposPrinter.ALIGN.CENTER,
//         BluetoothEscposPrinter.ALIGN.RIGHT,
//       ],
//       [
//         'Total',
//         sumArray(dataOrderDetail.items).toString(),
//         convertToRupiah(dataOrderDetail.totalAmount),
//       ],
//       {},
//     );
//     await BluetoothEscposPrinter.printText('\n\r', {});
//     await BluetoothEscposPrinter.printerAlign(
//       BluetoothEscposPrinter.ALIGN.CENTER,
//     );
//     await BluetoothEscposPrinter.printText('Terima kasih!\n\r\n\r\n\r', {});
//     await BluetoothEscposPrinter.printerAlign(
//       BluetoothEscposPrinter.ALIGN.LEFT,
//     );
//   } catch (e) {
//     setModalErrorPrinter(!modalErrorPrinter);
//   }
// try {
//   await BluetoothEscposPrinter.printerAlign(
//     BluetoothEscposPrinter.ALIGN.CENTER,
//   );

//   await BluetoothEscposPrinter.printerAlign(
//     BluetoothEscposPrinter.ALIGN.LEFT,
//   );
//   await BluetoothEscposPrinter.printText(
//     'Nama：Asepshow,reza,jurahi,hehe,gg,wadaw,nina,noni,gugus\n\r',
//     {},
//   );
//   await BluetoothEscposPrinter.printText(
//     'Jam Order：8 Maret, 2:49 Siang\n\r',
//     {},
//   );
//   await BluetoothEscposPrinter.printText(
//     '--------------------------------\n\r',
//     {},
//   );
//   let columnWidths = [12, 6, 6, 8];
//   await BluetoothEscposPrinter.printColumn(
//     columnWidths,
//     [
//       BluetoothEscposPrinter.ALIGN.LEFT,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.RIGHT,
//     ],
//     ['Pesanan', 'Qty', 'Harga', 'Total'],
//     {},
//   );
//   await BluetoothEscposPrinter.printText('\n\r', {});
//   await BluetoothEscposPrinter.printColumn(
//     columnWidths,
//     [
//       BluetoothEscposPrinter.ALIGN.LEFT,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.RIGHT,
//     ],
//     ['Nasi Goreng', '2', '32000', '64000'],
//     {},
//   );
//   await BluetoothEscposPrinter.printText('\n\r', {});
//   await BluetoothEscposPrinter.printColumn(
//     columnWidths,
//     [
//       BluetoothEscposPrinter.ALIGN.LEFT,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.RIGHT,
//     ],
//     ['Air putih', '1', '2000', '2000'],
//     {},
//   );
//   await BluetoothEscposPrinter.printText('\n\r', {});
//   await BluetoothEscposPrinter.printText(
//     '--------------------------------\n\r',
//     {},
//   );

//   await BluetoothEscposPrinter.printText('\n\r', {});
//   await BluetoothEscposPrinter.printText('Service：3%\n\r', {});
//   await BluetoothEscposPrinter.printText('\n\r', {});
//   await BluetoothEscposPrinter.printText('Pajak：4000.00\n\r', {});
//   await BluetoothEscposPrinter.printText(
//     '--------------------------------\n\r',
//     {},
//   );
//   await BluetoothEscposPrinter.printColumn(
//     [12, 6, 14],
//     [
//       BluetoothEscposPrinter.ALIGN.LEFT,
//       BluetoothEscposPrinter.ALIGN.CENTER,
//       BluetoothEscposPrinter.ALIGN.RIGHT,
//     ],
//     ['Total', '3', '1000000'],
//     {},
//   );
//   await BluetoothEscposPrinter.printText('\n\r', {});
//   await BluetoothEscposPrinter.printerAlign(
//     BluetoothEscposPrinter.ALIGN.CENTER,
//   );
//   await BluetoothEscposPrinter.printText('Terima kasih!\n\r\n\r\n\r', {});
//   await BluetoothEscposPrinter.printerAlign(
//     BluetoothEscposPrinter.ALIGN.LEFT,
//   );
// } catch (e) {
//   alert(e.message || 'ERROR');
// }
// };
export default SamplePrint;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 8,
    backgroundColor: '#00BCD4',
  },
});
