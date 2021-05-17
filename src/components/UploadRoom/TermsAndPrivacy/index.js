import React from 'react';
import {Checkbox, Input} from 'antd';

export default ({onChange}) => {
  return (
    <div style={{display: 'inline'}}>
      <Input.TextArea readOnly={true} style={{height: 'calc(100% - 50px)'}} value={text}/>
      <Checkbox style={{marginTop: '20px', userSelect: 'none'}} onChange={onChange}>
        Tôi đồng ý với điều khoản sử dụng dịch vụ và chính sách bảo mật của <a>HomoHouse</a>.
      </Checkbox>
    </div>
  );
}

const text = 'Trước hết, chúng tôi xin chân thành cám ơn các bạn đã quan tâm và có mong muốn sử dụng dịch vụ của chúng tôi. Trước khi bắt đầu tham quan HomoHouse cũng như sử dụng các dịch vụ trên trang website, xin vui lòng đọc cẩn thận và ghi nhớ Điều khoản Thoả thuận này. Việc sử dụng hoặc truy cập vào website HomoHouse sẽ được hiểu là sự chấp nhận và đồng ý ràng buộc vào Điều khoản Thoả thuận.\n' +
  'Điều Khoản Thoả Thuận truy cập website HomoHouse\n' +
  'Điều khoản Thoả thuận này được ký kết bởi và giữa HomoHouse với bất kỳ một cá nhân tổ chức hoặc một thực thể nào khác, những người truy cập hoặc sử dụng website HomoHouse (được gọi chung là "Người sử dụng” hoặc "bạn").\n' +
  '\n' +
  'HomoHouse là website được thiết kế cho phép thông tin về bất động sản và các lĩnh vực liên quan, bao gồm cả việc những người sử dụng đăng thông tin quảng cáo nhu cầu mua/bán/thuê/cho thuê bất động sản do những người sử dụng khác đăng lên, hoặc tương tác với những người sử dụng đó. HomoHouse chứa hoặc có thể chứa các thông tin, tin tức, các ý kiến, văn bản, đồ hoạ, các liên kết, sản phẩm nghệ thuật điện tử, hình ảnh động, âm thanh, video, phần mềm, tranh ảnh, âm nhạc, tiếng động và các nội dung, dữ liệu khác (gọi chung là "nội dung") được định dạng, tổ chức và thu thập dưới nhiều hình thức khác nhau mà người sử dụng có thể truy cập tới được, gồm thông tin trên website của HomoHouse mà người sử dụng có thể thay đổi được, chẳng hạn như đăng thông tin quảng cáo mua/bán/thuê/cho thuê bất động sản, tải lên các tập tin đa phương tiện.\n' +
  '\n' +
  '1. Trách nhiệm và hạn chế đối với người sử dụng\n' +
  '\n' +
  '1.1. Trách nhiệm của người sử dụng\n' +
  '\n' +
  '\n' +
  'Bạn đồng ý chỉ truy cập và dùng website HomoHouse với các mục đích hợp pháp. Bạn có trách nhiệm về việc hiểu biết và tuân thủ mọi điều luật, các quy chế, quy tắc và các quy định gắn liền với: (i) việc bạn sử dụng website HomoHouse, kể cả vùng tương tác bất kỳ, (ii) việc sử dụng mạng hay dịch vụ nào khác có kết nối tới website HomoHouse , (iii) phương tiện liên lạc mà nhờ đó, bạn nối môđem, máy tính hoặc các thiết bị khác của bạn tới website HomoHouse.\n' +
  '\n' +
  '1.2. Hạn chế đối với người sử dụng\n' +
  '\n' +
  '\n' +
  'Truy cập tới website HomoHouse, bạn đồng ý sẽ không:\n' +
  '•    Sử dụng bất kỳ thiết bị, phần mềm, quy trình, phương tiện để can thiệp hay cố gắng can thiệp vào hoạt động đúng đắn trên HomoHouse;\n' +
  '•    Hạn chế hoặc ngăn cản người sử dụng khác sử dụng và hưởng các tính năng tương tác;\n' +
  '•    Thực hiện bất kỳ hành động mà sẽ áp đặt một gánh nặng hoặc làm cho lưu lượng truy cập vào cơ sở hạ tầng của HomoHouse quá nhiều mà chúng tôi cho là không hợp lý hay không cân xứng với cách sử dụng HomoHouse;\n' +
  '•    Gửi hoặc chuyển các thông tin bất hợp pháp, đe doạ, lạm dụng, bôi nhọ, nói xấu, khiêu dâm, phi thẩm mỹ, xúc phạm hoặc bất kỳ loại thông tin không đúng đắn, bao gồm truyền bá tin tức góp phần hay khuyến khích hành vi phạm tội, gây ra trách nhiệm pháp lý dân sự hoặc vi phạm luật bất kỳ của một địa phương, bang, quốc gia, hay luật quốc tế nào;\n' +
  '•    Gửi hay chuyển các thông tin, phần mềm, hoặc các tài liệu khác bất kỳ, vi phạm hoặc xâm phạm các quyền của những người khác, trong đó bao gồm cả tài liệu xâm phạm đến quyền riêng tư hoặc công khai, hoặc tài liệu được bảo vệ bản quyền, tên thương mại hoặc quyền sở hữu khác, hoặc các sản phẩm phái sinh mà không được sự cho phép của người chủ sở hữu hoặc người có quyền hợp pháp;\n' +
  '•    Gửi hoặc chuyển thông tin, phần mềm hoặc tài liệu bất kỳ có chứa virus hoặc một thành phần gây hại khác;\n' +
  '•    Thay đổi, làm hư hại, xoá nội dung bất kỳ hoặc các phương tiện khác mà không phải là nội dung thuộc sở hữu của bạn; hoặc gây trở ngại cho những người khác truy cập tới website HomoHouse;\n' +
  '•    Gửi hoặc chuyển thư rác, thông tin về các cuộc thi, thông tin khảo sát, hoặc nhắn tin đại chúng khác, cho dù với mục đích thương mại hay không;\n' +
  '•    Phá vỡ luồng thông tin bình thường trong một tương tác;\n' +
  '•    Tuyên bố có liên hệ với hay phát ngôn cho một doanh nghiệp, hiệp hội, thể chế hay tổ chức nào khác mà bạn không được uỷ quyền tuyên bố mối liên hệ đó;\n' +
  '•    Vi phạm một quy tắc, chính sách hay hướng dẫn sử dụng nào của nhà cung cấp dịch vụ Internet cho bạn hay các dịch vụ trực tuyến;\n' +
  'Khi có hành vi vi phạm các quy định nêu trên, chúng tôi có quyền thực hiện bất kỳ hành động hợp pháp nào mà chúng tôi cho là cần thiết để ngăn chặn sự truy cập, sử dụng trái phép website HomoHouse, bao gồm việc sử dụng rào cản công nghệ, hoặc báo cáo về hành vi của bạn tới cơ quan nhà nước có thẩm quyền.\n' +
  '\n' +
  '2. Các quyền sở hữu trí tuệ\n' +
  '\n' +
  '\n' +
  '•    Bạn thừa nhận Nội dung trên website HomoHouse nói chung do HomoHouse, cộng tác viên cá nhân về nội dung ("Cộng tác viên"), người được cấp phép thứ ba, và/hoặc những người sử dụng khác cung cấp. Bạn thừa nhận website HomoHouse cho phép truy cập tới Nội dung được bảo vệ bản quyền, tên thương mại và các quyền sở hữu khác (kể cả quyền sở hữu trí tuệ) ("Quyền Sở hữu Trí tuệ"), và thừa nhận các quyền sở hữu trí tuệ đó là hợp lệ và được bảo vệ trên mọi phương tiện truyền thông hiện có và sau này, trừ những điểm nêu rõ ràng dưới đây, việc sử dụng nội dung của bạn sẽ được quản lý theo các luật bản quyền và các luật sở hữu trí tuệ hiện hành khác.\n' +
  '•    Bạn không thể thay đổi, sao chép, mô phỏng, truyền, phân phối, công bố, tạo ra các sản phẩm phái sinh, hiển thị hoặc chuyển giao, hoặc khai thác nhằm mục đích thương mại bất kỳ phần nào của nội dung, toàn bộ hay từng phần, mặc dù bạn có thể: (i) tạo một số lượng hợp lý các bản sao dưới dạng số hoặc hình thức khác để phần cứng và phần mềm máy tính của bạn có thể truy cập và xem được nội dung, (ii) in một bản sao của từng đoạn nội dung, (iii) tạo và phân phối một số lượng hợp lý các bản sao nội dung, toàn bộ hay từng phần, ở dạng bản in hoặc bản điện tử để dùng nội bộ. Bất kỳ bản sao nội dung được phép nào cũng phải được tái tạo ở dạng không thể biến đổi được các thông tri bất kỳ chứa trong nội dung, chẳng hạn như tất cả các thông tri về Quyền Sở hữu Trí tuệ, và các nguồn thông tin ban đầu cho “website HomoHouse” và địa chỉ mạng (URL) của nó. Bạn thừa nhận, website HomoHouse, các cộng tác viên, và/hoặc những người sử dụng vẫn là những người chủ sở hữu của nội dung và rằng, bạn sẽ không có bất kỳ Quyền Sở hữu Trí tuệ nào qua việc tải xuống hoặc in nội dung.\n' +
  'Nội dung do Người sử dụng cung cấp\n' +
  'Bạn chỉ có thể tải lên vùng tương tác bất kỳ hoặc truyền, gửi, công bố, mô phỏng hoặc phân phối trên hoặc thông qua website HomoHouse phần nội dung, không phụ thuộc vào bất kỳ Quyền Sở hữu Trí tuệ nào, hoặc nội dung mà người giữ Quyền Sở hữu Trí tuệ có sự ủy quyền rõ ràng về việc phân tán trên Internet và trên website HomoHouse mà không có hạn chế gì. Mọi nội dung được đưa ra với sự đồng ý của người sở hữu bản quyền không phải là bạn phải kèm theo câu như “do [tên người chủ sở hữu] sở hữu bản quyền; được dùng theo ủy quyền”.\n' +
  '\n' +
  'Với việc đưa nội dung lên vùng tương tác bất kỳ, bạn tự động chấp nhận và/hoặc cam đoan rằng, chủ sở hữu của nội dung đó , hoặc là bạn, hoặc là nhóm thứ ba, đã cho website HomoHouse quyền và giấy phép không phải trả tiền bản quyền, lâu dài, không thay đổi, không loại trừ, không hạn chế để sử dụng, mô phỏng, thay đổi, sửa lại, công bố, dịch thuật, tạo các sản phẩm phái sinh, cấp phép con, phân phối, thực hiện và hiển thị nội dung đó, toàn phần hay từng phần, khắp thế giới và/hoặc kết hợp nó với các công việc khác ở dạng bất kỳ, qua các phương tiện truyền thông hoặc công nghệ hiện tại hay sẽ phát triển sau này theo điều khoản đầy đủ của Quyền Sở hữu Trí tuệ bất kỳ trong nội dung đó. Bạn cũng cho phép website HomoHouse cấp giấy phép con cho bên thứ ba quyền không hạn chế để thực hiện bất kỳ quyền nào ở trên với nội dung đó. Bạn cũng cho phép người dùng truy cập, xem, lưu và mô phỏng lại nội dung để sử dụng riêng. Bạn cũng cho phép website HomoHouse dùng tên và logo công ty vì các mục đích tiếp thị\n' +
  '\n' +
  '3. Các vùng tương tác\n' +
  '\n' +
  '\n' +
  'Bạn thừa nhận, website HomoHouse có thể chứa các vùng tương tác khác nhau. Những vùng tương tác này cho phép phản hồi tới website HomoHouse và tương tác thời gian thực giữa những người sử dụng. Bạn cũng hiểu rằng, website HomoHouse không kiểm soát các thông báo, thông tin hoặc các tập tin được phân phối tới các vùng tương tác như vậy và rằng, website HomoHouse có thể cho bạn và những người sử dụng khác khả năng tạo và quản lý một vùng tương tác.\n' +
  '\n' +
  'Tuy nhiên, website HomoHouse, công ty mẹ, hoặc các chi nhánh, cũng như các giám đốc, nhân viên, những người làm thuê và các đại lý tương ứng không chịu trách nhiệm về nội dung trong vùng tương tác bất kỳ. Việc sử dụng và quản lý một vùng tương tác của bạn sẽ bị chi phối bởi Điều khoản Thoả thuận này và các quy tắc bổ sung bất kỳ, hoặc bởi các thủ tục hoạt động của vùng tương tác bất kỳ do bạn hay người sử dụng khác thiết lập. Bạn công nhận rằng, website HomoHouse không thể và không có ý định sàng lọc các thông tin trước. Ngoài ra, vì website HomoHouse khuyến khích liên lạc mở và không thiên vị trong các vùng tương tác nên website HomoHouse không thể xác định trước mức độ chính xác hoặc sự phù hợp đối với Điều khoản Thoả thuận này về nội dung bất kỳ được chuyển đi trong vùng tương tác.\n' +
  '\n' +
  'Website HomoHouse không chịu trách nhiệm với việc sàng lọc, lập chính sách, hiệu chỉnh, duyệt hoặc giám sát nội dung bất kỳ trong một vùng tương tác. Mặc dù vậy, bạn cũng đồng ý rằng website HomoHouse có quyền giám sát mọi vùng tương tác, đôi lúc để lộ thông tin nào đó nếu cần thiết theo yêu cầu luật pháp, hoặc yêu cầu khác của chính phủ đối với hoạt động của vùng tương tác, hoặc để tự bảo vệ mình hay những người sử dụng khác. Nếu được thông báo nội dung dẫn ra không phù hợp với bản Thỏa thuận này, website HomoHouse có thể thận trọng điều tra và xác định để loại bỏ, hoặc yêu cầu người sử dụng bỏ nội dung đó. Website HomoHouse giữ quyền cấm các hành động, truyền đạt tin tức hoặc nội dung trong phạm vi vùng tương tác, hoặc soạn thảo, từ chối gửi, hoặc loại bỏ nội dung bất kỳ, toàn thể hay từng phần mà với đặc quyền của mình, chúng tôi cho rằng (i) vi phạm các điều khoản tiêu chuẩn lúc đó của bản Thỏa thuận này hoặc chuẩn bất kỳ khác nằm trong chính sách của HomoHouse vẫn còn hiệu lực vào lúc đó, (ii) bất lợi với các quyền của mọi người sử dụng, của website HomoHouse hoặc các nhóm thứ ba khác, (iii) vi phạm luật hiện hành hoặc (iv) những điều không hay khác.\n' +
  '\n' +
  '4. Chấm dứt\n' +
  '\n' +
  '\n' +
  'Quyền duy nhất của bạn khi không thỏa mãn với mọi chính sách, nguyên tắc chỉ đạo hay hành động thực tiễn của website HomoHouse trong điều hành trang web, hoặc mọi thay đổi về nội dung là dừng sự truy cập tới website HomoHouse. Website HomoHouse có thể chấm dứt hoặc tạm thời ngưng sự truy cập của bạn đến tất cả hay phần bất kỳ của website HomoHouse mà không thông báo với các hành động khi HomoHouse tin là vi phạm Điều khoản Thỏa thuận này hoặc vi phạm mọi chính sách hay nguyên tắc chỉ đạo mà website HomoHouse đã đưa ra, hoặc với các hành động khác mà chúng tôi tin là có hại đến website HomoHouse và những người sử dụng khác.\n' +
  '\n' +
  'Website HomoHouse với đặc quyền riêng có thể đình chỉ sự hoạt động của nó và chấm dứt Điều khoản Thỏa thuận này mà không thông báo vào bất kỳ lúc nào và vì bất kỳ lý do nào theo đặc quyền của mình. Trong trường hợp chấm dứt, bạn không còn được phép truy cập đến website HomoHouse nữa, kể cả các vùng tương tác và các hạn chế của bạn về nội dung đươc tải xuống từ HomoHouse, cũng như những từ chối về quyền lợi và các giới hạn về các trách nhiệm pháp lý được nêu ra trong thỏa thuận này, vẫn còn giá trị.\n' +
  '\n' +
  '5. Các liên kết\n' +
  '\n' +
  '\n' +
  'Bạn hiểu rằng trừ phần nội dung, các sản phẩm và dịch vụ có trên website HomoHouse, công ty mẹ, hoặc các chi nhánh, cũng như các giám đốc, nhân viên, người làm công và các đại lý tương ứng kiểm soát, cung cấp không chịu trách nhiệm với nội dung, hàng hóa hoặc các dịch vụ của các sites khác trên Internet được kết nối tới hoặc từ website HomoHouse. Tất cả nội dung, hàng hóa và các dịch vụ đó đều có thể truy cập được trên Internet bởi bên thứ ba độc lập và không phải là một phần của website HomoHouse hoặc được kiểm soát bởi HomoHouse. Website HomoHouse không xác nhận và cũng không chịu trách nhiệm về tính chính xác, tính đầy đủ, tính hữu dụng, chất lượng và tính sẵn sàng của mọi nội dung, hàng hóa hay các dịch vụ có trên các site được kết nối tới hoặc từ website HomoHouse mà đó là trách nhiệm duy nhất của bên thứ ba độc lập đó, và do vậy việc sử dụng của bạn là sự mạo hiểm riêng của bạn.\n' +
  '\n' +
  'Website HomoHouse, công ty mẹ, hoặc các chi nhánh, hoặc các giám đốc, nhân viên, người làm công và các đại lý tương ứng không chịu trách nhiệm pháp lý, trực tiếp hay gián tiếp, với mọi mất mát hay thiệt hại gây ra bởi hoặc bị cho là gây ra bởi việc sử dụng hoặc sự tin cậy của bạn vào mọi nội dung, hàng hóa hoặc các dịch vụ có trên site bất kỳ được kết nối đến hoặc từ website HomoHouse, hoặc do bạn không thể truy cập lên Internet hay site bất kỳ kết nối đến hoặc từ website HomoHouse.\n' +
  '\n' +
  '6. Bồi thường\n' +
  '\n' +
  '\n' +
  'Bạn đồng ý trả tiền và miễn cho website HomoHouse, công ty mẹ và các chi nhánh, các giám đốc, nhân viên, những người làm công và các đại lý tương ứng tất cả các trách nhiệm pháp lý, các quyền được đòi hỏi và các phí tổn, kể cả các phí hợp lý cho luật sư, nảy sinh từ sự vi phạm Điều khoản Thỏa thuận này, từ chính sách bất kỳ khác, từ việc sử dụng hay truy cập của bạn tới website HomoHouse hoặc site internet đựơc kết nối đến hoặc từ website HomoHouse, hoặc về việc truyền nội dung bất kỳ trên website HomoHouse.\n' +
  '\n' +
  '7. Các vấn đề khác\n' +
  '\n' +
  '\n' +
  'Điều khoản Thoả thuận này bao gồm toàn bộ sự thoả thuận giữa website HomoHouse và bạn, và thay thế mọi thoả thuận trước đây về chủ đề này. Website HomoHouse có thể xét lại Điều khoản Thoả thuận này hoặc mọi chính sách khác vào bất cứ lúc nào và đôi khi, sự xem xét lại này sẽ có hiệu lực trong 2 ngày nhờ gửi thông báo về sự xem xét lại đó ở nơi dễ thấy trên website HomoHouse. Bạn đồng ý xem xét lại Điều khoản Thoả thuận này định kỳ để hiểu về những điều đã được sửa lại đó. Nếu bạn không chấp nhận các sửa đổi này, bạn phải thôi truy cập tới website HomoHouse . Sự tiếp tục truy cập của bạn và việc sử dụng website HomoHouse sau thông báo về mọi sửa đổi như vậy sẽ được coi chắc chắn là sự chấp nhận tất cả các sửa đổi như vậy.\n' +
  '\n' +
  'Việc website HomoHouse không thể đòi hỏi hoặc buộc thực hiện chặt chẽ mọi điều khoản của Điều khoản Thoả thuận này sẽ không được coi là sự khước từ điều khoản hay quyền bất kỳ.\n' +
  'Xin cám ơn bạn đã dành thời gian đọc bản Thỏa thuận này, và một lần nữa xin cám ơn bạn đã sử dụng dịch vụ của chúng tôi. Hy vọng rằng những thông tin trên HomoHouse sẽ hữu ích đối với bạn.';
