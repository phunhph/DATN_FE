const validation = {
    email: {
      required: 'Hãy nhập email.',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        message: 'Hãy nhập đúng định dạng email.',
      },
    },
    password: {
      required: 'Hãy nhập mật khẩu.',
      minLength: {
        value: 8,
        message: 'Mật khẩu chứa ít nhất 8 ký tự.',
      },
    },
  };
export default validation