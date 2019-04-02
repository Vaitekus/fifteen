(function(){
    var holder = document.getElementById('game');
    var currentRow;
    var currentRowNumber;
    var ceilCount = 4;
    var activeIndex;
    
    var numArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    var newArray = shuffleArray(numArray.slice(0));
    numArray.push(0);
    newArray.push(0);

    newArray.forEach(drawCeils);

    function drawCeils(num, index) {
        var currentNum = Math.floor(index / ceilCount);

        if (currentRowNumber !== currentNum) {
            currentRowNumber = currentNum;

            currentRow = document.createElement('div');
            currentRow.setAttribute('class', 'row');
            holder.appendChild(currentRow);
        }

        var ceil = document.createElement('span');
        ceil.setAttribute('class', 'ceil');
        ceil.setAttribute('data-index', index);
        ceil.innerHTML = num !== 0 ? num : '';
        currentRow.appendChild(ceil);

        if (num === 0) {
            activeIndex = index;
        }
    }

    function checkPosition(num) {
        var change = false;
        var number = parseInt(num);
        
        switch(number) {
            case activeIndex - 4:
            case activeIndex - 1:
            case activeIndex + 1:
            case activeIndex + 4:
                change = true;
                break;
            default:
                break;
        }

        if (change) arrayMove(newArray, number, activeIndex);
    };

    function arrayMove(arr, fromIndex, toIndex) {
        var oldValue = arr[fromIndex];
        var newValue = arr[toIndex];

        arr[fromIndex] = newValue;
        arr[toIndex] = oldValue;
        holder.innerHTML = '';

        if (JSON.stringify(numArray) == JSON.stringify(newArray)) {
            alert('well done');
        }

        newArray.forEach(drawCeils);
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }

    holder.addEventListener('click', function(e){
        var target = e.target;
        var index = target.getAttribute('data-index');
        
        if (index) {
            e.preventDefault();
            checkPosition(index);
        }
    })
}());
