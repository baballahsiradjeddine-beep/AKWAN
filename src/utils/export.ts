import toast from 'react-hot-toast';

export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (!data || data.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Handle strings with commas by wrapping in quotes
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success('تم التصدير بنجاح');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.error('حدث خطأ أثناء التصدير. إذا كنت تستخدم نافذة المعاينة، يرجى فتح التطبيق في نافذة جديدة.');
  }
};
